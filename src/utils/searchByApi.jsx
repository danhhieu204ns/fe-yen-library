import { Input, Space, Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Hàm search cơ bản cho text
export const getColumnSearchProps = (title, dataIndex) => {
    let searchText = '';  // Add this line

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Tìm ${title}`}
                    value={selectedKeys[0]}
                    onChange={e => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                        searchText = e.target.value;  // Update searchText when input changes
                    }}
                    onPressEnter={() => confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            confirm();
                            searchText = selectedKeys[0];  // Update searchText when confirming
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters?.();
                            searchText = '';  // Clear searchText when resetting
                            confirm();
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Xóa
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        )
    };
};

// Hàm search cho date range
export const getColumnSearchDateProps = (title, dataIndex) => {
    const handleSearch = async (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (setSelectedKeys, clearFilters, confirm) => {
        setSelectedKeys([]);
        clearFilters();
        confirm();
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="flex flex-col p-2" onKeyDown={(e) => e.stopPropagation()}>
                <RangePicker
                    format="DD/MM/YYYY"
                    onChange={(date, dateString) => {
                        setSelectedKeys(
                            dateString ? dateString.map((entry) => dayjs(entry, 'DD/MM/YYYY').format('YYYY-MM-DD')) : []
                        );
                    }} // Change search input into array to match selectedKeys form
                    size="small"
                    style={{
                        marginBottom: 8,
                    }}
                />
                <Space className="flex justify-between">
                    <Button
                        type="text"
                        onClick={() => {
                            handleReset(setSelectedKeys, clearFilters, confirm);
                        }}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined className={filtered ? 'stroke-primary' : ''} />,
    };
};
