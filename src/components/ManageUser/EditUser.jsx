import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useUserApi } from 'src/services/userService';
import { useRoleApi } from 'src/services/roleService';
import PropTypes from 'prop-types';

function EditUser({ data, openModal, closeModal, handleReload, setLoading }) {
    const [form] = Form.useForm();
    const [roleOptions, setRoleOptions] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    const { updateUser } = useUserApi();
    const { getRoles } = useRoleApi();

    useEffect(() => {
        if (openModal && data && Object.keys(data).length > 0) {
            form.setFieldsValue({
                username: data.username,
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                address: data.address,
                role_ids: data.role_ids,
            });
        }
    }, [data, openModal, form]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const roles = await getRoles();
                if (roles) {
                    const options = roles.map(role => ({
                        value: role.id,
                        label: role.name,
                    }));
                    setRoleOptions(options);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        
        if (openModal) {
            fetchRoles();
        }
    }, [openModal]);

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            if (setLoading) setLoading(true);
            
            const values = await form.validateFields();
            const userData = {
                ...values,
            };
            
            const success = await updateUser(data.id, userData);
            if (success) {
                closeModal();
                handleReload();
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setSubmitLoading(false);
            if (setLoading) setLoading(false);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa Người dùng"
            open={openModal}
            onCancel={closeModal}
            footer={[
                <Button key="back" onClick={closeModal}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submitLoading}
                    onClick={handleSubmit}
                >
                    Cập nhật
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    username: '',
                    full_name: '',
                    email: '',
                    phone_number: '',
                    address: '',
                    role_ids: []
                }}
            >
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="full_name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9]+$/, message: 'Vui lòng chỉ nhập số!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    name="role_ids"
                    label="Vai trò"
                >
                    <Select
                        mode="multiple"
                        options={roleOptions}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

EditUser.propTypes = {
    data: PropTypes.object,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleReload: PropTypes.func.isRequired,
    setLoading: PropTypes.func,
};

export default EditUser;
