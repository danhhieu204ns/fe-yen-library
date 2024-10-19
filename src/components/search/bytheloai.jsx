import React, { useState, useEffect } from 'react';
import { Input, List } from 'antd';
import { useOutletContext } from 'react-router-dom';

function SearchBookComponentByGenre() {
    const { allBooks } = useOutletContext(); // Lấy dữ liệu từ Outlet context
    const [searchValue, setSearchValue] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        // Cập nhật danh sách khi allBooks thay đổi
        setFilteredBooks(allBooks);
    }, [allBooks]);

    const handleSearch = (value) => {
        const filtered = allBooks.filter((book) =>
            book.genre.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBooks(filtered);
        setSearchValue(value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tìm theo thể loại</h2>
            <Input.Search
                placeholder="Nhập thể loại..."
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

export default SearchBookComponentByGenre;
