import { Modal, Upload, Button, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Dragger } = Upload;
const { Text } = Typography;

const ImportUserModal = ({ open, onClose, onFileChange, onImport, selectedFile }) => {
    const uploadProps = {
        accept: '.xlsx,.xls',
        beforeUpload: (file) => {
            onFileChange(file);
            return false;
        },
        onRemove: () => {
            onFileChange(null);
        },
        fileList: selectedFile ? [selectedFile] : []
    };

    return (
        <Modal
            title="Import Người dùng"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    onClick={onImport}
                    disabled={!selectedFile}
                >
                    Import
                </Button>
            ]}
        >
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">Chỉ hỗ trợ file Excel (.xlsx, .xls)</p>
            </Dragger>
            {selectedFile && (
                <Text type="success" className="mt-2 block">
                    Đã chọn file: {selectedFile.name}
                </Text>
            )}
        </Modal>
    );
};

ImportUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFileChange: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    selectedFile: PropTypes.object
};

export default ImportUserModal;
