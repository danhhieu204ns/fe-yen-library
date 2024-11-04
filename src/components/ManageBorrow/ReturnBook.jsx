import React, { memo, useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { Typography, Col, Row, Modal, Select, Button, Card } from 'antd';
import { useUserApi } from 'src/services/userService';
import useManageBorrowApi from 'src/services/manageBorrowService';
import useBookApi from 'src/services/manageBookService';

const { Text } = Typography;

function ReturnBook({ openModal, closeModal, handleReload }) {
    const [returnInfo, setReturnInfo] = useState({
        user_id: '',
        book_id: '',
    });
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userBorrows, setUserBorrows] = useState([]);
    const [borrowRecord, setBorrowRecord] = useState();
    const [isCapturingUser, setIsCapturingUser] = useState(false);
    const [isCapturingBook, setIsCapturingBook] = useState(false);

    const { getAllUser, checkUser } = useUserApi();
    const { getBorrowsWithUserID, getBorrowsWithUserIDAndBookID, returnBorrow } = useManageBorrowApi();
    const { checkBook } = useBookApi();
 
    const webcamRefUser = useRef(null);
    const webcamRefBook = useRef(null);

    useEffect(() => {
        getAllUser().then((users) => {
            setAllUsers(users);
            setFilteredUsers(users);
        });
    }, []);

    const handleSearchUsers = (value) => {
        const filtered = allUsers.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
        handleChange('user_id', value);
    };

    const handleChange = (key, value) => {
        setReturnInfo((prevInfo) => ({
            ...prevInfo,
            [key]: value,
        }));
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
            fetchUserBorrows(result.id);
        } else {
            toast.error('Không tìm thấy thông tin người dùng, hãy thử lại!');
        }
    };

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
            fetchBorrowRecord(returnInfo.user_id, result.id);
        } else {
            toast.error('Không tìm thấy sách, vui lòng thử lại!');
        }
    };

    const fetchUserBorrows = async (userId) => {
        const borrows = await getBorrowsWithUserID(userId);
        if (borrows) {
            setUserBorrows(borrows);
        } else {
            toast.error('Không tìm thấy đơn mượn nào cho người dùng này.');
        }
    };

    const fetchBorrowRecord = async (userId, bookId) => {
        if (userId && bookId) {
            const record = await getBorrowsWithUserIDAndBookID({ user_id: userId, book_id: bookId });
            if (record) {
                setBorrowRecord(record);
            } else {
                toast.error('Không tìm thấy đơn mượn nào khớp với thông tin đã nhập.');
                setBorrowRecord(null);
            }
        }
    };

    const handleReturnBook = async () => {
        if (!returnInfo.user_id || !returnInfo.book_id) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (!borrowRecord) {
            toast.error('Không có đơn mượn nào để trả.');
            return;
        }
        const result = await returnBorrow(borrowRecord.id);
        if (!result.detail) {
            toast.success('Trả sách thành công');
            setReturnInfo({ user_id: '', book_id: '' });
            setBorrowRecord(null);
            closeModal();
            handleReload();
        }
    };

    return (
        <Modal
            title="Trả sách"
            open={openModal}
            onCancel={() => {
                setReturnInfo({ user_id: '', book_id: '' });
                setBorrowRecord(null);
                closeModal();
            }}
            onOk={handleReturnBook}
            maskClosable={false}
        >
            <Row gutter={[12, 12]} className="p-4">
                <Col span={24}>
                    <Typography.Text className="font-semibold">Tên người dùng</Typography.Text>
                    <Select
                        showSearch
                        className="w-full"
                        placeholder="Nhập tên người dùng hoặc chọn"
                        value={returnInfo.user_id}
                        onSearch={handleSearchUsers}
                        onChange={(value) => {
                            handleChange('user_id', value);
                            fetchUserBorrows(value);
                        }}
                        filterOption={false}
                        options={filteredUsers.map((user) => ({ label: user.name, value: user.id }))}
                    />
                    <Button
                        onClick={() => setIsCapturingUser(true)}
                        className="mt-2"
                        type="primary"
                    >
                        Chụp ảnh khuôn mặt
                    </Button>
                    {isCapturingUser && (
                        <div className="mt-2">
                            <Webcam
                                audio={false}
                                ref={webcamRefUser}
                                screenshotFormat="image/jpeg"
                                className="w-full h-60"
                            />
                            <Button
                                onClick={captureUser}
                                type="primary"
                                className="mt-2"
                            >
                                Chụp ảnh
                            </Button>
                        </div>
                    )}
                </Col>
                <Col span={24}>
                    <Typography.Text className="font-semibold">Chọn sách mượn</Typography.Text>
                    <Select
                        showSearch
                        className="w-full"
                        placeholder="Chọn sách mượn"
                        value={returnInfo.book_id}
                        onChange={(value) => {
                            handleChange('book_id', value);
                            fetchBorrowRecord(returnInfo.user_id, value);
                        }}
                        filterOption={false}
                        options={userBorrows.map((borrow) => ({
                            label: borrow.book.name,
                            value: borrow.book.id,
                        }))}
                    />
                    <Button
                        onClick={() => setIsCapturingBook(true)}
                        className="mt-2"
                        type="primary"
                    >
                        Chụp ảnh bìa sách
                    </Button>
                    {isCapturingBook && (
                        <div className="mt-2">
                            <Webcam
                                audio={false}
                                ref={webcamRefBook}
                                screenshotFormat="image/jpeg"
                                className="w-full h-60"
                            />
                            <Button
                                onClick={captureBook}
                                type="primary"
                                className="mt-2"
                            >
                                Chụp ảnh
                            </Button>
                        </div>
                    )}
                </Col>
                <Col span={24}>
                    <Text className="font-semibold text-lg">Kết quả tìm đơn mượn</Text>
                    {borrowRecord ? (
                        <Card className="mt-4 p-4 shadow-lg border border-gray-200">
                            <div className="mb-2">
                                <Text strong>Tên sách:</Text> <Text>{borrowRecord.book?.name || 'Không tìm thấy tên sách'}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong>Người mượn:</Text> <Text>{borrowRecord.user?.name || 'Không tìm thấy tên người mượn'}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong>Trạng thái:</Text> <Text>{borrowRecord.status}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong>Ngày tạo:</Text> <Text>{new Date(borrowRecord.created_at).toLocaleDateString() || 'Không có thông tin'}</Text>
                            </div>
                        </Card>
                    ) : (
                        <div className="flex flex-col items-center mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
                            <Text type="danger" className="text-lg">Không tìm thấy đơn mượn nào khớp với thông tin đã nhập.</Text>
                            <Text className="text-gray-600">Vui lòng kiểm tra lại thông tin hoặc thử lại sau.</Text>
                        </div>
                    )}
</Col>
            </Row>
        </Modal>
    );
}

export default memo(ReturnBook);
