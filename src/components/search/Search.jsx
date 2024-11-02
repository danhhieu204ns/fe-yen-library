import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Input, Select, List, message, Button, Modal } from 'antd';
import { toast } from 'react-toastify';
import { selectCurrentToken, selectedCurrentUser } from '../../redux/auth/authSlice'
import useBookApi from '../../services/manageBookService'; 
import useBorrowApi from 'src/services/manageBorrowService';
const { Option } = Select;

function SearchBook() {
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('title');
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBorrowModalVisible, setIsBorrowModalVisible] = useState(false);
    const [borrowDays, setBorrowDays] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectedCurrentUser);
    const { getAllBooks } = useBookApi();
    const { createBorrowByUser } = useBorrowApi()

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await getAllBooks();
                setAllBooks(response);
                setFilteredBooks(response);
            } catch (error) {
                toast.error('Không thể tải dữ liệu sách');
            }
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        const filterBooks = () => {
            if (!searchTerm) {
                setFilteredBooks(allBooks);
                return;
            }
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = allBooks.filter((book) => {
                if (filterOption === 'title') {
                    return book.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'author') {
                    return book.author.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'genre') {
                    return book.genre.name.toLowerCase().includes(lowercasedTerm);
                }
                return false;
            });
            setFilteredBooks(filtered);
        };

        filterBooks();
    }, [searchTerm, filterOption, allBooks]);

    const handleViewBook = (book) => {
        setSelectedBook(book);
        setIsModalVisible(true);
    };

    const handleBorrowBook = (book) => {
        if (!token) {
            toast.error('Bạn cần đăng nhập để mượn sách');
            return;
        }
        if (book.status === "Hết sách") {
            toast.error('Sách tạm thời đã hết. Hãy quay lại sau nhé!')
            return;
        }
        setSelectedBook(book);
        setIsBorrowModalVisible(true);
    };

    const handleBorrowDaysChange = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 1 && value <= 7)) {
            setBorrowDays(value);
            setErrorMessage(''); // Xóa thông báo lỗi nếu giá trị hợp lệ
        } else {
            setErrorMessage('Số ngày phải từ 1 đến 7.');
        }
    };

    const handleConfirmBorrow = async () => {
        try {
            await createBorrowByUser({ // Gọi API để tạo yêu cầu mượn sách với thông tin cần thiết
                user_id: user.id, 
                book_id: selectedBook.id, // ID sách
                duration: borrowDays // Số ngày mượn
            });
            toast.success('Đăng ký mượn sách thành công');
            setIsBorrowModalVisible(false);
            setBorrowDays(1); // Đặt lại số ngày mượn về mặc định
        } catch (error) {
            toast.error('Đăng ký mượn sách thất bại');
        }
    };

    return (
        <div className="mt-[60px]" style={{ padding: '20px' }}>
            <div className="flex justify-center">
                <h1 className="text-2xl mt-[8px] mb-[10px]">Tra cứu sách</h1>
            </div>
            <h2>Tìm kiếm sách</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Input
                    placeholder="Nhập từ khóa tìm kiếm..."
                    allowClear
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '400px', marginRight: '10px' }}
                />
                <label style={{ marginRight: '10px' }}>Lọc theo:</label>
                <Select
                    value={filterOption}
                    onChange={(value) => setFilterOption(value)}
                    style={{ width: '200px' }}
                >
                    <Option value="title">Tên sách</Option>
                    <Option value="author">Tên tác giả</Option>
                    <Option value="genre">Thể loại</Option>
                </Select>
            </div>

            <div>
                <h3>Kết quả tìm kiếm:</h3>
                {filteredBooks.length > 0 ? (
                    <List
                        bordered
                        dataSource={filteredBooks}
                        renderItem={(book) => (
                            <List.Item key={book.id}>
                                <List.Item.Meta
                                    title={
                                        <a 
                                            onClick={() => handleViewBook(book)} 
                                            style={{ fontWeight: 'bold', fontSize: '16px' }} // Thay đổi cỡ chữ ở đây
                                        >
                                            {book.name}
                                        </a>
                                    }
                                    description={
                                        <>
                                            <span>Tác giả: {book.author.name} | Thể loại: {book.genre.name}</span>
                                            <br />
                                            <span
                                                style={{
                                                    padding: '4px 8px',
                                                    color: '#fff',
                                                    backgroundColor: book.status === 'Còn sách' ? 'green' : 'red',
                                                    borderRadius: '5px',
                                                    display: 'inline-block',
                                                    marginTop: '5px',
                                                }}
                                            >
                                                {book.status}
                                            </span>
                                        </>
                                    }
                                />
                                <Button onClick={() => handleBorrowBook(book)}>Mượn sách</Button>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>Không có kết quả nào phù hợp.</p>
                )}
            </div>

            {/* Modal xem chi tiết sách */}
            <Modal
                title="Thông tin sách"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedBook && (
                    <>
                        <p><strong>Tên sách:</strong> {selectedBook.name}</p>
                        <p><strong>Tác giả:</strong> {selectedBook.author.name}</p>
                        <p><strong>Thể loại:</strong> {selectedBook.genre.name}</p>
                        <p><strong>Nội dung:</strong> {selectedBook.content}</p>
                    </>
                )}
            </Modal>

            {/* Modal xác nhận mượn sách */}
            <Modal
                title="Xác nhận mượn sách"
                open={isBorrowModalVisible}
                onCancel={() => setIsBorrowModalVisible(false)}
                onOk={handleConfirmBorrow}
                okText="OK"
                cancelText="Hủy"
                disabled={!borrowDays || errorMessage !== ''} // Disable nút OK nếu có lỗi
            >
                {selectedBook && (
                    <div>
                        <p><strong>Tên người dùng:</strong> {user?.name}</p>
                        <p><strong>Tên sách:</strong> {selectedBook.name}</p>
                        <div style={{ marginTop: '10px' }}>
                            <label>Số ngày mượn:</label>
                            <Input
                                type="number"
                                value={borrowDays}
                                onChange={handleBorrowDaysChange}
                                style={{ width: '100px', marginLeft: '10px' }}
                            />
                            {errorMessage && (
                                <p style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default SearchBook;
