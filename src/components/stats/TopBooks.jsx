import { useEffect, useState } from "react";
import { useStatsApi } from "src/services/statsService";
import { topBorrowedBooks } from "src/mock/statsData";

const TopBooks = () => {
    // Start with mock data immediately to ensure something displays
    const [books, setBooks] = useState(topBorrowedBooks);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setBooks(topBorrowedBooks);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data");
                setBooks(topBorrowedBooks);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Create a default container style to ensure visibility
    const containerStyle = {
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '5px',
        margin: '10px',
        backgroundColor: '#f9f9f9',
        minHeight: '200px'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ color: '#333' }}>📚 Top 5 Sách Được Mượn Nhiều Nhất</h2>
            
            {isLoading && <div style={{ padding: '10px', color: 'blue' }}>Loading top books...</div>}
            
            {error && <div style={{ color: 'red', padding: '10px' }}>Error: {error}</div>}
            
            {!isLoading && Array.isArray(books) && books.length > 0 ? (
                <ul style={{ listStyleType: 'circle', paddingLeft: '25px' }}>
                    {books.map((book, index) => (
                        <li key={index} style={{ margin: '8px 0' }}>
                            <strong>{book.title}</strong> - <span>{book.borrow_count}</span> lượt mượn
                        </li>
                    ))}
                </ul>
            ) : !isLoading && (
                <p style={{ color: '#666' }}>Không có dữ liệu để hiển thị</p>
            )}
            
            <div style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
                Dữ liệu cập nhật lúc: {new Date().toLocaleString()}
            </div>
        </div>
    );
};

export default TopBooks;
