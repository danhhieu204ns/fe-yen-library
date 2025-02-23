import { Modal, Form, Input, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { useUserApi } from 'src/services/userService';

const CreateUser = ({ openModal, closeModal, handleReload }) => {
    const [form] = Form.useForm();
    const { createUser } = useUserApi();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await createUser(values);
            
            if (response?.message) {
                message.success('Tạo tài khoản thành công!');
                closeModal();
                handleReload();
                form.resetFields();
            } else {
                message.error(response?.detail || 'Tạo tài khoản thất bại!');
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    return (
        <Modal
            title="Tạo tài khoản mới"
            open={openModal}
            onCancel={() => {
                closeModal();
                form.resetFields();
            }}
            onOk={handleSubmit}
            okText="Tạo"
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
};

CreateUser.propTypes = {
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleReload: PropTypes.func.isRequired
};

export default CreateUser;
