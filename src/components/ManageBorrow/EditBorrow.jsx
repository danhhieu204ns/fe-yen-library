import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';
import useManageBorrowApi from 'src/services/manageBorrowService';
import useManageBookApi from 'src/services/manageBookService';
import { useUserApi } from 'src/services/userService';
import { useSelector } from 'react-redux';
import { selectedCurrentUser } from 'src/redux/auth/authSlice';

function EditBorrow({ openModal, closeModal, handleReload, data }) {
    const [bookName, setBookName] = useState('');
    const [userName, setUserName] = useState('');
    const [staffName, setStaffName] = useState('');
    const [duration, setDuration] = useState('');
    const [status, setStatus] = useState('');
    const [errorMessages, setErrorMessages] = useState('');
    const staff = useSelector(selectedCurrentUser);

    // Dữ liệu gốc và dữ liệu lọc
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const { editBorrow } = useManageBorrowApi();
    const { getAllBooks } = useManageBookApi();
    const { getAllUser } = useUserApi();

    useEffect(() => {
        const loadData = async () => {
            const books = await getAllBooks();
            const users = await getAllUser();
            setBooks(books);
            setUsers(users);
            setFilteredBooks(books);
            setFilteredUsers(users);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (data) {
            setBookName(data?.book?.name || '');
            setUserName(data?.user?.name || '');
            setStaffName(data?.staff?.name || '');
            setDuration(data?.duration || '');
            setStatus(data?.status || '');
        }
    }, [data]);

    const handleEditBorrow = async () => {
        setStaffName(staff.name)
        if (!bookName || bookName.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên sách');
            return;
        }
        if (!userName || userName.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên người dùng');
            return;
        }
        if (!duration || isNaN(duration) || Number(duration) <= 0) {
            setErrorMessages('Vui lòng nhập thời hạn hợp lệ');
            return;
        }

        const updatedData = {
            book_id: books.find(book => book.name === bookName)?.id,
            user_id: users.find(user => user.name === userName)?.id,
            staff_id: staff.id, // Lấy staff_id từ Redux
            duration: Number(duration),
            status: status.trim(),
        };

        const result = await editBorrow(data.id, updatedData);

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Thông tin mượn sách đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật thông tin mượn sách thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setBookName('');
            setUserName('');
            setStaffName('');
            setDuration('');
            setStatus('');
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Cập nhật thông tin mượn sách thành công');
        }
    };

    // Hàm lọc dữ liệu theo input
    const filterBooks = (input) => {
        return books.filter(book => book.name.toLowerCase().includes(input.toLowerCase()));
    };

    const filterUsers = (input) => {
        return users.filter(user => user.name.toLowerCase().includes(input.toLowerCase()));
    };

    return (
        <Modal
            title="Sửa thông tin mượn sách"
            open={openModal}
            onCancel={() => {
                setBookName('');
                setUserName('');
                setStaffName('');
                setDuration('');
                setStatus('');
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleEditBorrow}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên sách</Typography>
                    <Select
                        showSearch
                        placeholder="Chọn tên sách"
                        value={bookName}
                        style={{ width: '100%' }}  // Điều chỉnh độ rộng
                        onSearch={(value) => {
                            const filtered = filterBooks(value);
                            setFilteredBooks(filtered);
                        }}
                        onChange={(value) => setBookName(value)}
                        options={filteredBooks.map((book) => ({
                            label: book.name,
                            value: book.name,  // Sử dụng tên để tránh trùng key
                            key: book.id,      // Key là ID
                        }))}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tên người dùng</Typography>
                    <Select
                        showSearch
                        placeholder="Chọn tên người dùng"
                        value={userName}
                        style={{ width: '100%' }}  // Điều chỉnh độ rộng
                        onSearch={(value) => {
                            const filtered = filterUsers(value);
                            setFilteredUsers(filtered);
                        }}
                        onChange={(value) => setUserName(value)}
                        options={filteredUsers?.map((user) => ({
                            label: user.name,
                            value: user.name,  // Sử dụng tên để tránh trùng key
                            key: user.id,      // Key là ID
                        }))}
                    />
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
                    <Typography>Thời hạn (ngày)</Typography>
                    <Input
                        placeholder="Nhập thời hạn"
                        value={duration}
                        style={{ width: '100%' }}  // Điều chỉnh độ rộng
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Trạng thái</Typography>
                    <Select
                        placeholder="Chọn trạng thái"
                        value={status}
                        style={{ width: '100%' }}  // Điều chỉnh độ rộng
                        onChange={(value) => setStatus(value)}
                        options={[
                            { label: 'Đang chờ xác nhận', value: 'Đang chờ xác nhận' },
                            { label: 'Đang mượn', value: 'Đang mượn' },
                            { label: 'Đã trả', value: 'Đã trả' },
                            { label: 'Đã quá hạn', value: 'Đã quá hạn' },
                            { label: 'Đã hủy', value: 'Đã hủy' }                       
                        ]}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditBorrow);
