import { Modal, Row, Col, Input, Select, Typography } from 'antd';
import { useState } from 'react';
import { useUserApi } from 'src/services/userService';

function CreateUser({
    open,
    onCancel,
    reload,
}) {
    const disabled = false;

    const [username, setUsername] = useState('');
    const [userFullName, setUserFullName] = useState('');
    const [role, setRole] = useState('');
    const [active, setActive] = useState(false);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    const userService = useUserApi();

    const createUser = async (cancel) => {
        console.log('Update user info');
        const body = {
            username: username,
            full_name: userFullName,
            role: role,
        };
        let status = await userService.createUser(body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const error = async () => {
        let config = {
            title: 'Thêm mới thất bại',
            content: 'Đã có lỗi xảy ra! Vui lòng thử lại',
        };
        await modal.error(config);
    };

    const success = (cancel) => {
        let config = {
            title: 'Thêm mới thành công',
            content: 'Thông tin của người dùng đã được thêm mới thành công!',
            onOk() {
                cancel();
                if (reload != null) reload();
            },
        };
        modal.success(config);
    };

    return (
        <Modal
            title="Thêm người dùng"
            open={open}
            onCancel={onCancel}
            onOk={() => createUser(onCancel)}
        >   
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Tên người dùng</Typography>
                    <Input
                        disabled={disabled}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Typography>Họ tên</Typography>
                    <Input
                        disabled={disabled}
                        value={userFullName}
                        onChange={(e) => {
                            setUserFullName(e.target.value);
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Typography>Vai trò</Typography>
                    <Select
                        disabled={disabled}
                        value={role}
                        onChange={(value) => setRole(value)}
                        options={[
                            {label: 'Admin', value: 'Admin'},
                            {label: 'User', value: 'User'}
                        ]}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>
            {contextHolder}
        </Modal>
    );
}

export default CreateUser;
