import { memo } from 'react';
import { Modal, Upload, Button, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

function ImportAuthorModal({ open, onClose, onFileChange, onImport, selectedFile }) {
    const props = {
        name: 'file',
        maxCount: 1,
        accept: '.xlsx, .xls',
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                           file.type === 'application/vnd.ms-excel';
            
            if (!isExcel) {
                message.error('Chỉ chấp nhận file Excel!');
                return Upload.LIST_IGNORE;
            }

            onFileChange(file);
            return false;
        },
        onRemove: () => {
            onFileChange(null);
        }
    };

    return (
        <Modal
            title="Import Tác Giả từ Excel"
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
                    disabled={!selectedFile}
                >
                    Import
                </Button>
            ]}
            maskClosable={false}
            centered
            width={600}
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
            }}
        >
            <div className="p-4">
                <Typography.Text>
                    Chọn file Excel để import dữ liệu tác giả. 
                    File phải có định dạng .xlsx hoặc .xls
                </Typography.Text>
                <div className="mt-4">
                    <Dragger {...props} fileList={selectedFile ? [selectedFile] : []}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click hoặc kéo thả file vào đây
                        </p>
                        <p className="ant-upload-hint">
                            Hỗ trợ file .xlsx, .xls
                        </p>
                    </Dragger>
                </div>
            </div>
        </Modal>
    );
}

export default memo(ImportAuthorModal);
