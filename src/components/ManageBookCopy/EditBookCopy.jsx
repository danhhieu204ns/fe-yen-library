import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import useBookCopyApi from 'src/services/manageBookCopyService';
import useBookshelfApi from 'src/services/bookshelfService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function EditBookCopy({ openModal, closeModal, handleReload, data }) {
    const [status, setStatus] = useState('');
    const [bookshelfId, setBookshelfId] = useState(null);
    const [bookshelfs, setBookshelfs] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');
    const [loading, setLoading] = useState(false);

    const { updateBookCopy } = useBookCopyApi();
    const { bookshelfName } = useBookshelfApi();

    useEffect(() => {
        if (data) {
            setStatus(data.status || '');
            setBookshelfId(data.bookshelf?.id || null);
        }
    }, [data]);

    useEffect(() => {
        if (openModal) {
            const fetchData = async () => {
                try {
                    const response = await bookshelfName();

                    let processedData = [];
                    if (response?.status === 200) {
                        if (Array.isArray(response.data)) {
                            processedData = response.data;
                        } else if (Array.isArray(response.data?.bookshelfs)) {
                            processedData = response.data.bookshelfs;
                        } else if (typeof response.data === 'object') {
                            // If it's an object with direct key-value pairs
                            processedData = Object.values(response.data);
                        }
                    }

                    if (!Array.isArray(processedData)) {
                        console.error('Processed data is not an array:', processedData);
                        processedData = [];
                    }

                    setBookshelfs(processedData);
                } catch (error) {
                    console.error('Error fetching bookshelves:', error);
                    setBookshelfs([]);
                    toast.error('Lỗi khi tải danh sách kệ sách');
                }
            };
            fetchData();
        }
    }, [openModal]);

    const handleEditBookCopy = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const updatedData = {
                status: status.trim(),
                bookshelf_id: bookshelfId
            };

            const response = await updateBookCopy(data.id, updatedData);
            
            if (response?.status === 200) {
                toast.success('Cập nhật thành công!');
                resetForm();
                closeModal();
                handleReload();
            } else {
                toast.error('Cập nhật thất bại!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!bookshelfId) {
            setErrorMessages('Vui lòng chọn kệ sách');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setBookshelfId(null);
        setStatus('');
        setErrorMessages('');
    };

    const filterOption = (input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Modal
            title={<div className="text-lg">Sửa thông tin Bản sao sách</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleEditBookCopy}
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
                        <Typography.Text strong className="text-base">Kệ sách:</Typography.Text>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Tìm kiếm hoặc chọn kệ sách"
                            optionFilterProp="children"
                            value={data?.bookshelf?.name}
                            onChange={(value) => {
                                setBookshelfId(value);
                                setErrorMessages('');
                            }}
                            filterOption={filterOption}
                            className="mt-2"
                        >
                            {bookshelfs.map(bookshelf => (
                                <Select.Option key={bookshelf.id} value={bookshelf.id}>
                                    {bookshelf.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tình trạng:</Typography.Text>
                        <Input
                            placeholder="Nhập tình trạng sách"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <ErrorMessage message={errorMessages} />
                </Row>
            </div>
        </Modal>
    );
}

export default memo(EditBookCopy);
