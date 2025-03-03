import { useState, useEffect, memo } from 'react';
import { Input, Typography, Modal, Select, Row, Col } from 'antd';
import useBookCopyApi from 'src/services/manageBookCopyService';
import useBookshelfApi from 'src/services/bookshelfService';
import { toast } from 'react-toastify';

function EditBookCopy({ openModal, closeModal, handleReload, data }) {
    const [bookshelfId, setBookshelfId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookshelfs, setBookshelfs] = useState([]);

    const { updateBookCopy } = useBookCopyApi();
    const { bookshelfName } = useBookshelfApi();
    
    useEffect(() => {
        if (openModal) {
            if (data) {
                setBookshelfId(data?.bookshelf?.id);
            }
            const fetchData = async () => {
                try {
                    const response = await bookshelfName();     
                    setBookshelfs(response.data.bookshelfs || []); 
                } catch (error) {
                    console.error('Error fetching bookshelves:', error);
                    toast.error('Lỗi khi tải danh sách kệ sách');
                }
            };
            
            fetchData();
        }
    }, [openModal, data]);

    const handleFinish = async () => {
        try {
            setLoading(true);
            const updatedData = {
                bookshelf_id: bookshelfId
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
            onOk={handleFinish}
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
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tên sách:</Typography.Text>
                        <Input disabled className="w-full" value={data?.book?.name}/>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Kệ sách:</Typography.Text>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Tìm kiếm hoặc chọn kệ sách"
                            optionFilterProp="children"
                            value={bookshelfId}
                            onChange={(value) => {
                                setBookshelfId(value);
                            }}
                            className="mt-2"
                        >
                            {bookshelfs.map(bookshelf => (
                                <Select.Option key={bookshelf.id} value={bookshelf.id}>
                                    {bookshelf.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tình trạng:</Typography.Text>
                        <Input disabled className="w-full" value={data.status}/>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default memo(EditBookCopy);
