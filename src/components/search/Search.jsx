import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { Outlet } from 'react-router-dom';
import useDashboardApi from '../../services/searchService';

function SearchContainer() {
    const [allBooks, setAllBooks] = useState([]);
    const { listgroupbook } = useDashboardApi();

    useEffect(() => {
        // Gọi API một lần khi component cha được mount
        const fetchBooks = async () => {
            try {
                const response = await listgroupbook(); // Gọi API lấy sách
                setAllBooks(response);
            } catch (error) {
                message.error('Không thể tải dữ liệu sách');
            }
        };

        fetchBooks();
    }, []);

    return (
        <div>
            {/* Outlet cho phép render các route con */}
            <Outlet context={{ allBooks }} />
        </div>
    );
}

export default SearchContainer;
