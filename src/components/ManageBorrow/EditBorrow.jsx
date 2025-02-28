import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, Spin } from 'antd';
import { toast } from 'react-toastify';
import useManageBorrowApi from 'src/services/manageBorrowService';

function EditBorrow({ data, openModal, closeModal, handleReload }) {
    const [form] = Form.useForm();
    const { editBorrow } = useManageBorrowApi();
    const [loading, setLoading] = useState(false);

    // Pre-fill form with data when modal opens
    useEffect(() => {
        if (openModal && data) {
            // Reset form first
            form.resetFields();
            
            // Set values for all fields
            form.setFieldsValue({
                book_name: data?.book_copy?.book?.name || '',
                user_name: data?.user?.full_name || '',
                staff_name: data?.staff?.full_name || '',
                duration: data.duration,
                status: data.status
            });
        }
    }, [form, data, openModal]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            const result = await editBorrow(data.id, {
                duration: values.duration,
                status: values.status
            });

            if (result?.status >= 400) {
                toast.error('Cập nhật thất bại');
                return;
            }
            
            toast.success('Cập nhật thành công');
            handleReload();
            closeModal();
        } catch (error) {
            console.error("Validation failed:", error);
            toast.error('Cập nhật thất bại: ' + (error.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin mượn sách"
            open={openModal}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="edit_borrow"
                >
                    <Form.Item
                        name="book_name"
                        label="Sách"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="user_name"
                        label="Người dùng"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="staff_name"
                        label="Nhân viên"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Thời hạn (ngày)"
                        rules={[{ required: true, message: 'Vui lòng nhập thời hạn!' }]}
                    >
                        <Input type="number" min={1} max={7} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="Đang chờ xác nhận">Đang chờ xác nhận</Select.Option>
                            <Select.Option value="Đang mượn">Đang mượn</Select.Option>
                            <Select.Option value="Đã trả">Đã trả</Select.Option>
                            <Select.Option value="Đã quá hạn">Đã quá hạn</Select.Option>
                            <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}

export default EditBorrow;
