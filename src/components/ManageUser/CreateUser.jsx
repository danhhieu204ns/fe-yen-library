import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useUserApi } from 'src/services/userService';
import PropTypes from 'prop-types';

function CreateUser({ openModal, closeModal, handleReload, setLoading }) {
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    
    const { createUser } = useUserApi();

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            if (setLoading) setLoading(true);
            
            const values = await form.validateFields();
            const userData = {
                ...values,
            };
            
            const response = await createUser(userData);
            if (response && response.id) {
                closeModal();
                form.resetFields();
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
            title="Thêm Người dùng"
            open={openModal}
            onCancel={() => {
                form.resetFields();
                closeModal();
            }}
            footer={[
                <Button key="back" onClick={() => {
                    form.resetFields();
                    closeModal();
                }}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submitLoading}
                    onClick={handleSubmit}
                >
                    Tạo mới
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
                    roles: ['user']
                }}
            >
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input />
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
            </Form>
        </Modal>
    );
}

CreateUser.propTypes = {
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleReload: PropTypes.func.isRequired,
    setLoading: PropTypes.func,
};

export default CreateUser;
