import React, { useState } from 'react';
import { Input, List } from 'antd';
import { useOutletContext } from 'react-router-dom';

function SearchBookComponentByAuthor() {
    // Lấy dữ liệu allBooks từ context được truyền qua Outlet
    const { allBooks } = useOutletContext(); 
    const [searchValue, setSearchValue] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(allBooks);

    const handleSearch = (value) => {
        const filtered = allBooks.filter((book) =>
            book.author.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBooks(filtered);
        setSearchValue(value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tìm theo tác giả</h2>
            <Input.Search
                placeholder="Nhập tên tác giả..."
                allowClear
                enterButton="Tìm"
                size="large"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: '20px', width: '400px' }}
            />
            <List
                bordered
                dataSource={filteredBooks}
                renderItem={(book) => (
                    <List.Item key={book.id}>
                        <List.Item.Meta
                            title={book.name}
                            description={`Tác giả: ${book.author.name} | Thể loại: ${book.genre.name}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}

export default SearchBookComponentByAuthor;
