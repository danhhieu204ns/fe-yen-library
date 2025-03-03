import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, Spin } from 'antd';
import { toast } from 'react-toastify';
import useManageBorrowApi from 'src/services/manageBorrowService';

function EditBorrow({ data, openModal, closeModal, handleReload }) {
    const [form] = Form.useForm();
    const { editBorrow } = useManageBorrowApi();
    const [loading, setLoading] = useState(false);

    const [currentStatus, setCurrentStatus] = useState('');
    
    useEffect(() => {
        if (data?.status) {
            setCurrentStatus(data.status);
        }
    }, [data]);

    useEffect(() => {
        if (openModal && data) {
            form.resetFields();
            
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

    // Get available status options based on current status
    const getStatusOptions = () => {
        if (currentStatus === "Đang chờ xác nhận") {
            return [
                <Select.Option key="waiting" value="Đang chờ xác nhận">Đang chờ xác nhận</Select.Option>,
                <Select.Option key="borrowing" value="Đang mượn">Đang mượn</Select.Option>,
                <Select.Option key="cancelled" value="Đã hủy">Đã hủy</Select.Option>
            ];
        } else if (currentStatus === "Đang mượn") {
            return [
                <Select.Option key="borrowing" value="Đang mượn">Đang mượn</Select.Option>,
                <Select.Option key="returned" value="Đã trả">Đã trả</Select.Option>
            ];
        } else {
            // For other statuses, return just the current one (read-only)
            return [
                <Select.Option key={currentStatus} value={currentStatus}>{currentStatus}</Select.Option>
            ];
        }
    };

    // Handle status change in the form
    const handleStatusChange = (value) => {
        setCurrentStatus(value);
    };

    const isFormDisabled = currentStatus === "Đã hủy";

    return (
        <Modal
            title="Chỉnh sửa thông tin mượn sách"
            open={openModal}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleSubmit} 
                    loading={loading}
                    disabled={isFormDisabled}
                >
                    Cập nhật
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="edit_borrow"
                    disabled={isFormDisabled}
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
                        <Select onChange={handleStatusChange}>
                            {getStatusOptions()}
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}

export default EditBorrow;
