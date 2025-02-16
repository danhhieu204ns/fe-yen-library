import { Input, Space, Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Không khác gì lắm so với SearchInColumn.
// QUAN TRỌNG: TỰ NÓ KO SEARCH ĐC. Cần phải sử dụng với onChange ở Table để search cùng filter bình thường
export function getColumnSearchProps(title, dataIndex) {
    const [searchText, setSearchText] = useState(''); // Update Highlight state
    const [searchedColumn, setSearchedColumn] = useState(''); // Isolate Highlight to only searched column?
    const searchInput = useRef(null); // Hold search input

    const handleSearch = async (selectedKeys, confirm, dataIndex) => {
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        confirm();
    };

    const handleReset = (setSelectedKeys, clearFilters, confirm) => {
        setSearchText('');
        setSelectedKeys([]);
        clearFilters();
        // reset();
        confirm();
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm trong ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])} // Change search input into array to match selectedKeys form
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
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
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    };
}

export function getColumnSearchDateProps(title, dataIndex) {
    const handleSearch = async (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (setSelectedKeys, clearFilters, confirm) => {
        setSelectedKeys([]);
        clearFilters();
        // reset();
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
}
