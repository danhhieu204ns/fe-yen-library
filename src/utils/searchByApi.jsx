import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

export const getColumnSearchProps = (placeholder, dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
                placeholder={`Tìm ${placeholder}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => confirm()}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    type="primary"
                    onClick={() => confirm()}
                    size="small"
                    style={{ width: 90 }}
                >
                    Tìm
                </Button>
                <Button
                    onClick={() => {
                        clearFilters();
                        confirm();
                    }}
                    size="small"
                    style={{ width: 90 }}
                >
                    Xóa
                </Button>
            </div>
        </div>
    ),
    filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
        record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
});
