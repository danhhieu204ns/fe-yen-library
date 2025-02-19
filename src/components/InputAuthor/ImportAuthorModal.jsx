import { Modal, Button, Upload, Typography, Space } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

function ImportAuthorModal({ open, onClose, onFileChange, onImport, selectedFile }) {
    const generateExcelTemplate = () => {
        const wb = XLSX.utils.book_new();
        const headers = ['Tên tác giả', 'Ngày sinh', 'Địa chỉ', 'Bút danh', 'Tiểu sử'];
        const sampleRows = [
            ['Nguyễn Văn A', '29/09/1999', 'Hà Nội', 'Pen Name', 'Tiểu sử tác giả'],
        ];
        const wsData = [headers, ...sampleRows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'author_import_template.xlsx');
    };

    return (
        <Modal
            title="Import tác giả"
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
            styles={{
                body: {
                    padding: '24px',
                    backgroundColor: '#f0f2f5',
                    borderRadius: '8px'
                }
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                    <Upload 
                        accept=".xlsx,.xls"
                        maxCount={1}
                        beforeUpload={(file) => {
                            onFileChange(file);
                            return false;
                        }}
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
                        File đã chọn: {selectedFile instanceof File ? selectedFile.name : selectedFile.originFileObj?.name}
                    </Typography.Text>
                )}
            </Space>
        </Modal>
    );
}

export default ImportAuthorModal;
