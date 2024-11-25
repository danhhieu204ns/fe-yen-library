import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';
import useManageBorrowApi from 'src/services/manageBorrowService';
import useManageBookgroupApi from 'src/services/manageBookgroupService';
import { useUserApi } from 'src/services/userService';
import { useAdminApi } from 'src/services/adminService';

function EditBorrow({ openModal, closeModal, handleReload, data }) {
    const [bookgroupName, setBookgroupName] = useState('');
    const [userName, setUserName] = useState('');
    const [staffName, setStaffName] = useState('');
    const [duration, setDuration] = useState('');
    const [status, setStatus] = useState('');
    const [errorMessages, setErrorMessages] = useState('');

    // Dữ liệu gốc và dữ liệu lọc
    const [bookGroups, setBookGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [staffs, setStaffs] = useState([]);
    
    const [filteredBookGroups, setFilteredBookGroups] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredStaffs, setFilteredStaffs] = useState([]);

    const { editBorrow } = useManageBorrowApi();
    const { allBookgroups } = useManageBookgroupApi();
    const { getAllUser } = useUserApi();
    const { getAllAdmin } = useAdminApi();

    useEffect(() => {
        // Tải danh sách sách, người dùng và nhân viên khi component được render
        const loadData = async () => {
            const bookGroups = await allBookgroups();
            const users = await getAllUser();
            const staffs = await getAllAdmin();
            
            // Lưu trữ toàn bộ dữ liệu gốc
            setBookGroups(bookGroups);
            setUsers(users);
            setStaffs(staffs);

            // Hiển thị toàn bộ danh sách ban đầu
            setFilteredBookGroups(bookGroups);
            setFilteredUsers(users);
            setFilteredStaffs(staffs);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (data) {
            setBookgroupName(data?.bookgroup?.name || '');
            setUserName(data?.user?.name || '');
            setStaffName(data?.staff?.name || '');
            setDuration(data?.duration || '');
            setStatus(data?.status || '');
        }
    }, [data]);

    const handleEditBorrow = async () => {
        if (!bookgroupName || bookgroupName.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên sách');
            return;
        }

        if (!userName || userName.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên người dùng');
            return;
        }

        if (!staffName || staffName.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên nhân viên');
            return;
        }

        if (!duration || isNaN(duration) || Number(duration) <= 0) {
            setErrorMessages('Vui lòng nhập thời hạn hợp lệ');
            return;
        }

        const updatedData = {
            bookgroup_id: bookGroups.find(book => book.name === bookgroupName)?.id,
            user_id: users.find(user => user.name === userName)?.id,
            staff_id: staffs.find(staff => staff.name === staffName)?.id,
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
            setBookgroupName('');
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
    const filterBookGroups = (input) => {
        return bookGroups.filter(book => book.name.toLowerCase().includes(input.toLowerCase()));
    };

    const filterUsers = (input) => {
        return users.filter(user => user.name.toLowerCase().includes(input.toLowerCase()));
    };

    const filterStaffs = (input) => {
        return staffs.filter(staff => staff.name.toLowerCase().includes(input.toLowerCase()));
    };

    return (
        <Modal
            title="Sửa thông tin mượn sách"
            open={openModal}
            onCancel={() => {
                setBookgroupName('');
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
                        value={bookgroupName}
                        style={{ width: '100%' }}  // Điều chỉnh độ rộng
                        onSearch={(value) => {
                            const filtered = filterBookGroups(value);
                            setFilteredBookGroups(filtered);
                        }}
                        onChange={(value) => setBookgroupName(value)}
                        options={filteredBookGroups.map((book) => ({
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
                        options={filteredUsers.map((user) => ({
                            label: user.name,
                            value: user.name,  // Sử dụng tên để tránh trùng key
                            key: user.id,      // Key là ID
                        }))}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tên nhân viên</Typography>
                    <Select
                        showSearch
                        placeholder="Chọn tên nhân viên"
                        value={staffName}
                        style={{ width: '100%' }}  // Điều chỉnh độ rộng
                        onSearch={(value) => {
                            const filtered = filterStaffs(value);
                            setFilteredStaffs(filtered);
                        }}
                        onChange={(value) => setStaffName(value)}
                        options={filteredStaffs.map((staff) => ({
                            label: staff.name,
                            value: staff.name,  // Sử dụng tên để tránh trùng key
                            key: staff.id,      // Key là ID
                        }))}
                    />
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
                            { label: 'Đang mượn', value: 'Đang mượn' },
                            { label: 'Đã trả', value: 'Đã trả' },
                        ]}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditBorrow);
