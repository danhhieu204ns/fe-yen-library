import { useState, useEffect, memo } from 'react';
import { Input, Typography, Modal, Select, Form, Spin } from 'antd';
import useBookCopyApi from 'src/services/manageBookCopyService';
import useBookshelfApi from 'src/services/bookshelfService';
import { toast } from 'react-toastify';

function EditBookCopy({ openModal, closeModal, handleReload, data }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [bookshelfs, setBookshelfs] = useState([]);

    const { updateBookCopy } = useBookCopyApi();
    const { bookshelfName } = useBookshelfApi();
    
    // Reset form and fetch data when modal opens
    useEffect(() => {
        if (openModal && data) {
            // Set form values from data
            form.setFieldsValue({
                book_name: data?.book?.name || '',
                bookshelf_id: data?.bookshelf?.id || null,
                bookshelf_name: data?.bookshelf?.name || '',
                status: data?.status || ''
            });
            
            // Fetch complete list of bookshelves
            setDataLoading(true);
            const fetchData = async () => {
                try {
                    const response = await bookshelfName();
                    let shelves = [];
                    
                    if (response?.status === 200) {
                        if (Array.isArray(response.data)) {
                            shelves = response.data;
                        } else if (Array.isArray(response.data?.bookshelfs)) {
                            shelves = response.data.bookshelfs;
                        } else if (typeof response.data === 'object') {
                            shelves = Object.values(response.data);
                        }
                    }
                    setBookshelfs(shelves);
                } catch (error) {
                    console.error('Error fetching bookshelves:', error);
                    toast.error('Lỗi khi tải danh sách kệ sách');
                } finally {
                    setDataLoading(false);
                }
            };
            
            fetchData();
        }
    }, [openModal, data, form]);

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            const updatedData = {
                status: values.status.trim(),
                bookshelf_id: values.bookshelf_id
            };

            const response = await updateBookCopy(data.id, updatedData);
            
            if (response?.status === 200) {
                toast.success('Cập nhật thành công!');
                closeModal();
                handleReload();
            } else {
                toast.error('Cập nhật thất bại!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<div className="text-lg">Sửa thông tin Bản sao sách</div>}
            open={openModal}
            onCancel={closeModal}
            onOk={() => form.submit()}
            confirmLoading={loading}
            maskClosable={false}
            centered
            width={600}
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
                background: '#fff',
            }}
        >
            <div className="p-4">
                <Spin spinning={dataLoading} tip="Đang tải dữ liệu...">
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        <Form.Item
                            label={<Typography.Text strong className="text-base">Tên sách:</Typography.Text>}
                            name="book_name"
                        >
                            <Input disabled className="w-full" />
                        </Form.Item>
                        
                        <Form.Item
                            label={<Typography.Text strong className="text-base">Kệ sách:</Typography.Text>}
                            name="bookshelf_id"
                            rules={[{ required: true, message: 'Vui lòng chọn kệ sách' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn kệ sách"
                                filterOption={(input, option) => 
                                    (option?.children?.toLowerCase() || '').includes(input.toLowerCase())
                                }
                                loading={dataLoading}
                            >
                                {bookshelfs.map(bookshelf => (
                                    <Select.Option key={bookshelf.id} value={bookshelf.id}>
                                        {bookshelf.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        
                        <Form.Item
                            label={<Typography.Text strong className="text-base">Tình trạng:</Typography.Text>}
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}
                        >
                            <Select placeholder="Chọn tình trạng sách">
                                <Select.Option value="Chưa mượn">Chưa mượn</Select.Option>
                                <Select.Option value="Đã mượn">Đã mượn</Select.Option>
                                <Select.Option value="Đã mất">Đã mất</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </Modal>
    );
}

export default memo(EditBookCopy);
