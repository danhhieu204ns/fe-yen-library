import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, InputNumber } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useUserApi } from 'src/services/userService';

function EditUser({
    open,
    onClose,
    reload,
    record,
}) {
    const [disabled, setDisabled] = useState(true);
    const [username, setUsername] = useState(null);
    const [userFullName, setUserFullName] = useState(null);
    const [role, setRole] = useState(null);
    const [active, setActive] = useState(null);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    let userRecordId = useRef(null); // ID to call API

    const userService = useUserApi();

    // Set to disable when close or open
    useEffect(() => {
        setDisabled(true);
    }, [open]);

    useEffect(() => {
        setUsername(record?.username);
        setUserFullName(record?.full_name);
        setRole(record?.role);
        setActive(record?.active_user);

        userRecordId.current = record?.id;
    }, [open]);

    const updateUserInfo = async (cancel) => {
        if (disabled) {
            console.log('Editing is disabled. Not update');
            cancel();
            return;
        }
        console.log('Update user info');
        const body = {
            username: username,
            full_name: userFullName,
            role: role,
        };
        let status = await userService.updateUserById(userRecordId.current, body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const updateInfoOnSearch = (data) => {
        setRole(data?.full_name);
        setUsername(data?.student_code);
        setActive(data?.student_class_id)
    };

    const error = async () => {
        let config = {
            title: 'Cập nhật thất bại',
            content: 'Đã có lỗi xảy ra! Vui lòng thử lại',
        };
        await modal.error(config);
    };

    const success = (cancel) => {
        let config = {
            title: 'Cập nhật thành công',
            content: 'Thông tin của người dùng đã được cập nhật thành công!',
            onOk() {
                cancel();
                if (reload != null) reload();
            },
        };
        modal.success(config);
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin"
            open={open}
            onCancel={onClose}
            onOk={() => updateUserInfo(onClose)}
        >   
            <Checkbox className="my-2" onChange={(e) => setDisabled(!e.target.checked)} checked={!disabled}>
                Sửa
            </Checkbox>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Tên người dùng</Typography>
                    <Input
                        disabled
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

export default EditUser;
