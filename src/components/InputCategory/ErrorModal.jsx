import { Modal, Button, Typography } from 'antd';

function ErrorModal({ open, onClose, errorMessages }) {
    return (
        <Modal
            title="Lỗi khi import file"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            centered
            style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}
        >
            <Typography.Text>
                {errorMessages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </Typography.Text>
        </Modal>
    );
}

export default ErrorModal;
