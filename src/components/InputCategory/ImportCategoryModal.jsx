import React from 'react';
import { Modal, Button, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const ImportCategoryModal = ({ open, onClose, onFileChange, onImport, selectedFile, loading }) => {
  const { Dragger } = Upload;

  const props = {
    name: 'file',
    multiple: false,
    accept: '.xlsx, .xls',
    beforeUpload: (file) => {
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
      title="Import Thể Loại"
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
        >
          Import
        </Button>,
      ]}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này để tải lên</p>
        <p className="ant-upload-hint">Chỉ hỗ trợ file Excel (.xls, .xlsx)</p>
      </Dragger>
    </Modal>
  );
};

export default ImportCategoryModal;
