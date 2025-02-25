import { Modal, Form, Input, Select, message } from 'antd';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUserApi } from 'src/services/userService';

const EditUser = ({ data, openModal, closeModal, handleReload }) => {
    const [form] = Form.useForm();
    const { updateUserById } = useUserApi();

    useEffect(() => {
        if (data && openModal) {
            form.setFieldsValue({
                username: data.username,
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                address: data.address,
                roles: data.roles
            });
        }
    }, [data, openModal, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const res = await updateUserById(data.id, values);
            if (res.status === 200) {
                message.success('Cập nhật thông tin người dùng thành công');
                closeModal();
                handleReload();
            }
            else {
                message.error('Cập nhật thông tin người dùng thất bại');
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin người dùng"
            open={openModal}
            onCancel={() => {
                closeModal();
                form.resetFields();
            }}
            onOk={handleSubmit}
            okText="Lưu"
            cancelText="Hủy"
            width={600}
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
                background: '#fff',
            }}
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
                    roles: []
                }}
            >
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
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
                    name="roles"
                    label="Vai trò"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn vai trò"
                        options={[
                            { value: 'admin', label: 'Admin' },
                            { value: 'user', label: 'User' }
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

EditUser.propTypes = {
    data: PropTypes.object,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleReload: PropTypes.func.isRequired
};

export default EditUser;
