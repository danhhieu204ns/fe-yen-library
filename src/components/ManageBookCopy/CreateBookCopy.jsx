import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import useBookCopyApi from 'src/services/manageBookCopyService';
import useBookApi from 'src/services/manageBookService';
import useBookshelfApi from 'src/services/bookshelfService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateBookCopy({ openModal, closeModal, handleReload }) {
    const [status, setStatus] = useState('');
    const [bookshelfId, setBookshelfId] = useState(null);
    const [bookId, setBookId] = useState(null);
    const [books, setBooks] = useState([]);
    const [bookshelfs, setBookshelfs] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');
    const [loading, setLoading] = useState(false);

    const { createBookCopy } = useBookCopyApi();
    const { bookName } = useBookApi();
    const { bookshelfName } = useBookshelfApi();

    useEffect(() => {
        if (openModal) {
            const fetchData = async () => {
                try {
                    // Fetch and handle books data
                    const booksResponse = await bookName();
                    if (booksResponse?.status === 200 && Array.isArray(booksResponse.data?.books)) {
                        setBooks(booksResponse.data.books);
                    } else if (booksResponse?.status === 200 && Array.isArray(booksResponse.data)) {
                        setBooks(booksResponse.data);
                    } else {
                        console.error('Invalid books response:', booksResponse);
                        setBooks([]);
                    }

                    // Fetch and handle bookshelfs data
                    const bookshelfsResponse = await bookshelfName();
                    if (bookshelfsResponse?.status === 200 && Array.isArray(bookshelfsResponse.data?.bookshelfs)) {
                        setBookshelfs(bookshelfsResponse.data.bookshelfs);
                    } else if (bookshelfsResponse?.status === 200 && Array.isArray(bookshelfsResponse.data)) {
                        setBookshelfs(bookshelfsResponse.data);
                    } else {
                        console.error('Invalid bookshelfs response:', bookshelfsResponse);
                        setBookshelfs([]);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setBooks([]);
                    setBookshelfs([]);
                    toast.error('Lỗi khi tải dữ liệu!');
                }
            };
            fetchData();
        }
    }, [openModal]);

    const handleCreateBookCopy = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const bookCopyData = {
                status: status.trim(),
                book_id: bookId,
                bookshelf_id: bookshelfId
            };

            const response = await createBookCopy(bookCopyData);
            if (response?.status === 201 || response?.status === 200) {
                toast.success('Tạo mới thành công!');
                resetForm();
                closeModal();
                handleReload();
            } else {
                toast.error('Tạo mới thất bại!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tạo mới thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!bookId) {
            setErrorMessages('Vui lòng chọn sách');
            return false;
        }
        if (!bookshelfId) {
            setErrorMessages('Vui lòng chọn kệ sách');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setBookId(null);
        setBookshelfId(null);
        setStatus('');
    };

    const filterOption = (input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Modal
            title={<div className="text-lg">Tạo mới Bản sao sách</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleCreateBookCopy}
            confirmLoading={loading}
            maskClosable={false}
            centered
            width={600}
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
                background: '#fff',
            }}
        >
            <div className="p-4">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tên sách:</Typography.Text>
                        <Select
                            showSearch
                            placeholder="Chọn sách"
                            value={bookId}
                            onChange={(value) => {
                                setBookId(value);
                                setErrorMessages('');
                            }}
                            filterOption={filterOption}
                            className="mt-2 w-full"
                        >
                            {books.map((book) => (
                                <Select.Option key={book.id} value={book.id}>
                                    {book.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Kệ sách:</Typography.Text>
                        <Select
                            showSearch
                            placeholder="Chọn kệ sách"
                            value={bookshelfId}
                            onChange={(value) => {
                                setBookshelfId(value);
                                setErrorMessages('');
                            }}
                            filterOption={filterOption}
                            className="mt-2 w-full"
                        >
                            {bookshelfs.map((bookshelf) => (
                                <Select.Option key={bookshelf.id} value={bookshelf.id}>
                                    {bookshelf.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tình trạng:</Typography.Text>
                        <Select
                            placeholder="Chọn tình trạng Bản sao sách"
                            value={status}
                            onChange={(value) => setStatus(value)}
                            className="mt-2 w-full"
                        >
                            <Select.Option value="Chưa mượn">Chưa mượn</Select.Option>
                            <Select.Option value="Đã mượn">Đã mượn</Select.Option>
                            <Select.Option value="Đã mất">Đã mất</Select.Option>
                        </Select>
                    </Col>
                    <ErrorMessage message={errorMessages} />
                </Row>
            </div>
        </Modal>
    );
}

export default memo(CreateBookCopy);
