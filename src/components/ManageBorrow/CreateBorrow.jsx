import { memo, useState, useEffect } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';
import useManageBorrowApi from 'src/services/manageBorrowService';
import useManageBookgroupApi from 'src/services/manageBookgroupService';
import { useUserApi } from 'src/services/userService';
import { useAdminApi } from 'src/services/adminService';

function CreateBorrow({ openModal, closeModal, handleReload }) {
    const [borrowInfo, setBorrowInfo] = useState({
        bookgroup_id: '',
        user_id: '',
        staff_id: '',
        duration: '',
    });
    const [allBooks, setAllBooks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allStaffs, setAllStaffs] = useState([]);

    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');

    const { createBorrow } = useManageBorrowApi();
    const { allBookgroups } = useManageBookgroupApi();
    const { getAllUser } = useUserApi();
    const { getAllAdmin } = useAdminApi();

    useEffect(() => {
        // Fetch all data once on component mount
        allBookgroups().then((books) => {
            setAllBooks(books);
            setFilteredBooks(books);
        });

        getAllUser().then((users) => {
            setAllUsers(users);
            setFilteredUsers(users);
        });

        getAllAdmin().then((staffs) => {
            setAllStaffs(staffs);
            setFilteredStaffs(staffs);
        });
    }, []);

    const handleSearchBooks = (value) => {
        const filtered = allBooks.filter((book) =>
            book.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBooks(filtered);
        handleChange('bookgroup_id', value); // Allow keyboard input
    };

    const handleSearchUsers = (value) => {
        const filtered = allUsers.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
        handleChange('user_id', value); // Allow keyboard input
    };

    const handleSearchStaffs = (value) => {
        const filtered = allStaffs.filter((staff) =>
            staff.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStaffs(filtered);
        handleChange('staff_id', value); // Allow keyboard input
    };

    const handleCreateBorrow = async () => {
        const { bookgroup_id, user_id, staff_id, duration } = borrowInfo;

        if (!bookgroup_id || !user_id || !staff_id || !duration) {
            setErrorMessages('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const result = await createBorrow({
            bookgroup_id,
            user_id,
            staff_id,
            duration: Number(duration),
        });

        if (result?.name === 'AxiosError') {
            toast.error('Tạo thông tin mượn sách thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setBorrowInfo({
                bookgroup_id: '',
                user_id: '',
                staff_id: '',
                duration: '',
            });
            setErrorMessages('');
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
        setErrorMessages('');
    };

    return (
        <Modal
            title="Tạo thông tin mượn sách"
            open={openModal}
            onCancel={() => {
                setBorrowInfo({
                    bookgroup_id: '',
                    user_id: '',
                    staff_id: '',
                    duration: '',
                });
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleCreateBorrow}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên sách</Typography>
                    <Select
                        showSearch
                        style={{ width: '100%' }} // Đặt độ rộng tối đa
                        placeholder="Nhập tên sách hoặc chọn"
                        value={borrowInfo.bookgroup_id}
                        onSearch={handleSearchBooks}
                        onChange={(value) => handleChange('bookgroup_id', value)}
                        filterOption={false}
                        options={filteredBooks.map((book) => ({ label: book.name, value: book.id }))}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tên người dùng</Typography>
                    <Select
                        showSearch
                        style={{ width: '100%' }} // Đặt độ rộng tối đa
                        placeholder="Nhập tên người dùng hoặc chọn"
                        value={borrowInfo.user_id}
                        onSearch={handleSearchUsers}
                        onChange={(value) => handleChange('user_id', value)}
                        filterOption={false}
                        options={filteredUsers.map((user) => ({ label: user.name, value: user.id }))}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tên nhân viên</Typography>
                    <Select
                        showSearch
                        style={{ width: '100%' }} // Đặt độ rộng tối đa
                        placeholder="Nhập tên nhân viên hoặc chọn"
                        value={borrowInfo.staff_id}
                        onSearch={handleSearchStaffs}
                        onChange={(value) => handleChange('staff_id', value)}
                        filterOption={false}
                        options={filteredStaffs.map((staff) => ({ label: staff.name, value: staff.id }))}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Thời hạn (ngày)</Typography>
                    <Input
                        style={{ width: '100%' }} // Đặt độ rộng tối đa
                        placeholder="Nhập thời hạn"
                        value={borrowInfo.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(CreateBorrow);
