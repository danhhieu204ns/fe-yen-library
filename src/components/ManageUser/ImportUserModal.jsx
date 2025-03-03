import React from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Dragger } = Upload;

function ImportUserModal({ open, onClose, onFileChange, onImport, selectedFile, loading }) {
    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.xlsx, .xls',
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                           file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                message.error('Chỉ hỗ trợ file Excel!');
                return Upload.LIST_IGNORE;
            }
            onFileChange(file);
            return false; // Prevent upload
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
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={onImport}
                    loading={loading}
                    disabled={!selectedFile}
                >
                    Import
                </Button>,
            ]}
        >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Kéo thả file hoặc nhấp để chọn file</p>
                <p className="ant-upload-hint">
                    Hỗ trợ file Excel (.xlsx, .xls). Sử dụng mẫu file được cung cấp để đảm bảo dữ liệu chính xác.
                </p>
            </Dragger>
            {selectedFile && (
                <div className="mt-2 text-center">
                    File đã chọn: <strong>{selectedFile.name}</strong>
                </div>
            )}
        </Modal>
    );
}

ImportUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFileChange: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    selectedFile: PropTypes.object,
    loading: PropTypes.bool,
};

ImportUserModal.defaultProps = {
    loading: false,
};

export default ImportUserModal;
