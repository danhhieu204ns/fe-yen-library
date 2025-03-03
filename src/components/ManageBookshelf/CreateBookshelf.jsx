import { useState, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import useBookshelfApi from 'src/services/bookshelfService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function CreateBookshelf({ openModal, closeModal, handleReload }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [errorMessages, setErrorMessages] = useState('');
    const [loading, setLoading] = useState(false);

    const { createBookshelf } = useBookshelfApi();

    const handleCreateBookshelf = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên kệ sách');
            return;
        }

        try {
            setLoading(true);
            const bookshelfData = {
                name: name.trim(),
                status: status.trim()
            };

            const response = await createBookshelf(bookshelfData);
            
            if (response?.message) {
                toast.success('Tạo mới thành công!');
                resetForm();
                closeModal();
                handleReload();
            } else {
                toast.error(`Tạo mới thất bại! ${response?.detail}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tạo mới thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setStatus('');
    };

    return (
        <Modal
            title={<div className="text-lg">Tạo mới kệ sách</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleCreateBookshelf}
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
                        <Typography.Text strong className="text-base">Tên kệ sách:</Typography.Text>
                        <Input
                            placeholder="Nhập tên kệ sách"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorMessages('');
                            }}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tình trạng:</Typography.Text>
                        <Input
                            placeholder="Nhập tình trạng kệ sách"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <ErrorMessage message={errorMessages} />
                </Row>
            </div>
        </Modal>
    );
}

export default memo(CreateBookshelf);
