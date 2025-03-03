import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import useBookshelfApi from 'src/services/bookshelfService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function EditBookshelf({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [errorMessages, setErrorMessages] = useState('');

    const { updateBookshelf } = useBookshelfApi();

    useEffect(() => {
        if (openModal) {
            if (data) {
                setName(data?.name || '');
                setStatus(data?.status || '');
            }
        }
    }, [openModal, data]);

    const handleEditBookshelf = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên kệ sách');
            return;
        }

        const updatedData = {
            name: name.trim(),
            status: status.trim(),
        };
        
        try {
            const result = await updateBookshelf(data.id, updatedData);

            if (result?.message) {
                toast.success('Cập nhật kệ sách thành công');
                resetForm();
                closeModal();
                handleReload();
            } else {
                toast.error('Cập nhật kệ sách thất bại. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Cập nhật kệ sách thất bại. Vui lòng thử lại!');
        }
    };

    const resetForm = () => {
        setName('');
        setStatus('');
        setErrorMessages('');
    };

    return (
        <Modal
            title={<div className="text-lg">Sửa thông tin kệ sách</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleEditBookshelf}
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

export default memo(EditBookshelf);
