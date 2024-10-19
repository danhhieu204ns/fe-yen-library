import { Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import { useEffect, useRef, useState } from 'react';

// Tà đạo
export function getColumnSearchProps(title, dataIndex){
    const [searchText, setSearchText] = useState(''); // Update Highlight state
    const [searchedColumn, setSearchedColumn] = useState(''); // Isolate Highlight to only searched column?
    const searchInput = useRef(null); // Hold search input

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (setSelectedKeys, clearFilters, confirm) => {
        setSearchText('');
        setSelectedKeys([]);
        clearFilters();
        confirm();
    };
    return {       
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
            className='p-2'
            onKeyDown={(e) => e.stopPropagation()}
            >
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
            <Space className='flex justify-between'>
                <Button
                    type='text'
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
        filterIcon: (filtered) => (
            <SearchOutlined
            className= {filtered?'stroke-primary':''}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
    }
}

