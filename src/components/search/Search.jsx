import React, { useState, useEffect } from 'react';
import { Input, Select, List, message } from 'antd';
import useSearchBookApi from '../../services/searchService';

const { Option } = Select;

function SearchBook() {
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('title'); // Mặc định lọc theo tên sách

    const { listgroupbook } = useSearchBookApi();

    useEffect(() => {
        // Gọi API một lần khi component được mount
        const fetchBooks = async () => {
            try {
                const response = await listgroupbook(); // Gọi API lấy sách
                setAllBooks(response);
                setFilteredBooks(response); // Khởi tạo dữ liệu lọc bằng toàn bộ dữ liệu sách
            } catch (error) {
                message.error('Không thể tải dữ liệu sách');
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        // Lọc sách dựa trên từ khóa tìm kiếm và tùy chọn lọc
        const filterBooks = () => {
            if (!searchTerm) {
                setFilteredBooks(allBooks);
                return;
            }

            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = allBooks.filter((book) => {
                if (filterOption === 'title') {
                    return book.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'author') {
                    return book.author.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'genre') {
                    return book.genre.name.toLowerCase().includes(lowercasedTerm);
                }
                return false;
            });
            setFilteredBooks(filtered);
        };

        filterBooks();
    }, [searchTerm, filterOption, allBooks]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tìm kiếm sách</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Input
                    placeholder="Nhập từ khóa tìm kiếm..."
                    allowClear
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '400px', marginRight: '10px' }} // Độ rộng của search box và khoảng cách
                />
                <label style={{ marginRight: '10px' }}>Lọc theo:</label>
                <Select
                    value={filterOption}
                    onChange={(value) => setFilterOption(value)}
                    style={{ width: '200px' }} // Độ rộng của filter option
                >
                    <Option value="title">Tên sách</Option>
                    <Option value="author">Tên tác giả</Option>
                    <Option value="genre">Thể loại</Option>
                </Select>
            </div>

            {/* Hiển thị dữ liệu lọc được */}
            <div>
                <h3>Kết quả tìm kiếm:</h3>
                {filteredBooks.length > 0 ? (
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
                ) : (
                    <p>Không có kết quả nào phù hợp.</p>
                )}
            </div>
        </div>
    );
}

export default SearchBook;
