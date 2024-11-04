import React, { memo, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { Input, Typography, Col, Row, Modal, Select, Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectedCurrentUser } from 'src/redux/auth/authSlice';
import { useUserApi } from 'src/services/userService';
import useManageBorrowApi from 'src/services/manageBorrowService';
import useManageBookApi from 'src/services/manageBookService';

function CreateBorrow({ openModal, closeModal, handleReload }) {
    const [borrowInfo, setBorrowInfo] = useState({
        book_id: '',
        user_id: '',
        staff_id: '',
        duration: '',
    });
    const [allBooks, setAllBooks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isCapturingBook, setIsCapturingBook] = useState(false);
    const [isCapturingUser, setIsCapturingUser] = useState(false);
    const staff = useSelector(selectedCurrentUser);

    const { createBorrow } = useManageBorrowApi();
    const { getAllBooks, checkBook } = useManageBookApi();
    const { getAllUser, checkUser } = useUserApi();

    useEffect(() => {
        getAllBooks().then((books) => {
            setAllBooks(books);
            setFilteredBooks(books);
        });
        getAllUser().then((users) => {
            setAllUsers(users);
            setFilteredUsers(users);
        });
    }, []);

    const handleSearchBooks = (value) => {
        const filtered = allBooks.filter((book) =>
            book.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBooks(filtered);
        handleChange('book_id', value);
    };

    const handleSearchUsers = (value) => {
        const filtered = allUsers.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
        handleChange('user_id', value);
    };

    const handleCreateBorrow = async () => {
        const { book_id, user_id, duration } = borrowInfo;
        if (!book_id || !user_id || !duration) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const result = await createBorrow({
            book_id,
            user_id,
            staff_id: staff.id,
            duration: Number(duration),
        });
        console.log(result)
        if (result?.detail) {
            toast.error(result.detail);
            return;
        }
        else {
            setBorrowInfo({
                book_id: '',
                user_id: '',
                staff_id: '',
                duration: '',
            });
            closeModal();
            handleReload();
            toast.success('Tạo thông tin mượn sách thành công');
        }
    };

    const handleChange = (key, value) => {
        setBorrowInfo({
            ...borrowInfo,
            [key]: value
        });
    };

    const webcamRefBook = React.useRef(null);
    const webcamRefUser = React.useRef(null);

    const captureBook = async () => {
        const imageSrc = webcamRefBook.current.getScreenshot();
        setIsCapturingBook(false);
        const formDataToSend = new FormData();
            if (imageSrc) {
                formDataToSend.append('book_img', imageSrc);
            }
        const result = await checkBook(formDataToSend);
        if (result?.id) {
            handleChange('book_id', result.id);
        } else {
            toast.error('Không tìm thấy thông tin bìa sách, hãy thử lại!');
        }
    };

    const captureUser = async () => {
        const imageSrc = webcamRefUser.current.getScreenshot();
        setIsCapturingUser(false);
        const formDataToSend = new FormData();
        if (imageSrc) {
            formDataToSend.append('user_img', imageSrc);
        }
        const result = await checkUser(formDataToSend);
        if (result?.id) {
            handleChange('user_id', result.id);
        } else {
            toast.error('Không tìm thấy thông tin người dùng, hãy thử lại!');
        }
    };

    return (
        <Modal
            title="Tạo thông tin mượn sách"
            open={openModal}
            onCancel={() => {
                setBorrowInfo({
                    book_id: '',
                    user_id: '',
                    staff_id: '',
                    duration: '',
                });
                closeModal();
            }}
            onOk={handleCreateBorrow}
            maskClosable={false}
        >
            <Row gutter={[12, 12]} className="p-4">
                <Col span={24}>
                    <Typography.Text className="font-semibold">Tên sách</Typography.Text>
                    <Select
                        showSearch
                        className="w-full"
                        placeholder="Nhập tên sách hoặc chọn"
                        value={borrowInfo.book_id}
                        onSearch={handleSearchBooks}
                        onChange={(value) => handleChange('book_id', value)}
                        filterOption={false}
                        options={filteredBooks.map((book) => ({ label: book.name, value: book.id }))}
                    />
                    <Button
                        onClick={() => {
                            setIsCapturingBook(true);
                        }}
                        className="mt-2"
                        type="primary"
                    >
                        Chụp ảnh bìa sách
                    </Button>
                    {isCapturingBook && (
                        <div className="mt-2">
                            <Webcam
                                audio={false}
                                ref={webcamRefBook} // Tham chiếu cho bìa sách
                                screenshotFormat="image/jpeg"
                                className="w-full h-60"
                            />
                            <Button
                                onClick={captureBook} // Gọi hàm captureBook khi ấn nút chụp ảnh
                                type="primary"
                                className="mt-2"
                            >
                                Chụp ảnh
                            </Button>
                        </div>
                    )}
                </Col>
                <Col span={24}>
                    <Typography.Text className="font-semibold">Tên người dùng</Typography.Text>
                    <Select
                        showSearch
                        className="w-full"
                        placeholder="Nhập tên người dùng hoặc chọn"
                        value={borrowInfo.user_id}
                        onSearch={handleSearchUsers}
                        onChange={(value) => handleChange('user_id', value)}
                        filterOption={false}
                        options={filteredUsers.map((user) => ({ label: user.name, value: user.id }))}
                    />
                    <Button
                        onClick={() => {
                            setIsCapturingUser(true);
                        }}
                        className="mt-2"
                        type="primary"
                    >
                        Chụp ảnh khuôn mặt
                    </Button>
                    {isCapturingUser && (
                        <div className="mt-2">
                            <Webcam
                                audio={false}
                                ref={webcamRefUser} // Tham chiếu cho khuôn mặt
                                screenshotFormat="image/jpeg"
                                className="w-full h-60"
                            />
                            <Button
                                onClick={captureUser} // Gọi hàm captureUser khi ấn nút chụp ảnh
                                type="primary"
                                className="mt-2"
                            >
                                Chụp ảnh
                            </Button>
                        </div>
                    )}
                </Col>
                <Col span={24}>
                    <Typography>Tên nhân viên</Typography>
                    <div style={{ 
                        border: '1px solid #d9d9d9', // Viền mỏng
                        padding: '8px',             // Khoảng cách bên trong
                        borderRadius: '4px'         // Bo góc
                    }}>
                        <Typography.Text>{staff.name}</Typography.Text> {/* Hiển thị tên nhân viên */}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text className="font-semibold">Thời hạn (ngày)</Typography.Text>
                    <Input
                        className="w-full"
                        placeholder="Nhập thời hạn"
                        value={borrowInfo.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default memo(CreateBorrow);
