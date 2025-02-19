import { Modal, Button, Upload, Typography, Space } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

function ImportCategoryModal({ open, onClose, onFileChange, onImport, selectedFile }) {
    const generateExcelTemplate = () => {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();

        // Headers matching the uploaded file
        const headers = ['Tên danh mục', 'Giới hạn tuổi', 'Mô tả'];

        // Sample rows to demonstrate format
        const sampleRows = [
            ['Danh mục A', '18', 'Mô tả cho danh mục A'],
            // ['Danh mục B', '21', 'Mô tả cho danh mục B'],
            // ['Danh mục C', '16', 'Mô tả cho danh mục C'],
        ];

        // Create worksheet data with headers and sample rows
        const wsData = [headers, ...sampleRows];

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Template');

        // Generate blob and download
        XLSX.writeFile(wb, 'category_import_template.xlsx');
    };

    return (
        <Modal
            title="Import thể loại"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="import" type="primary" onClick={onImport}>
                    Import
                </Button>,
            ]}
            centered
            style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                    <Upload 
                        name="file" 
                        beforeUpload={() => false} // Prevent automatic upload
                        onChange={onFileChange}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                    </Upload>
                    <Button icon={<DownloadOutlined />} onClick={generateExcelTemplate}>
                        Download mẫu file
                    </Button>
                </Space>
                {selectedFile && (
                    <Typography.Text style={{ marginTop: '16px', display: 'block' }}>
                        {selectedFile.name}
                    </Typography.Text>
                )}
            </Space>
        </Modal>
    );
}

export default ImportCategoryModal;
