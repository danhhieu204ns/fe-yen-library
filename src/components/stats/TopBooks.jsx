import { useEffect, useState } from "react";
import { useStatsApi } from "src/services/statsService";
import { topBorrowedBooks } from "src/mock/statsData";

const TopBooks = () => {
    // Start with mock data immediately to ensure something displays
    const [books, setBooks] = useState(topBorrowedBooks);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { getTopBorrowedBooks } = useStatsApi();

    useEffect(() => {
        console.log("TopBooks component mounted");
        
        const fetchData = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching top books data...");
                
                // Use mock data initially for debugging
                // Comment this section back in when API is working
                /*
                const res = await getTopBorrowedBooks();
                console.log("API response:", res);
                
                if (Array.isArray(res.data)) {
                    console.log("Setting books from API response array");
                    setBooks(res.data);
                } else if (res.data && typeof res.data === 'object') {
                    console.log("API returned object, extracting array");
                    const booksArray = res.data.books || res.data.results || [];
                    setBooks(booksArray);
                } else {
                    console.log("Invalid API response format, using mock data");
                    setBooks(topBorrowedBooks);
                }
                */
                
                // Force using mock data for now
                console.log("Using mock data:", topBorrowedBooks);
                setBooks(topBorrowedBooks);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data");
                console.log("Setting mock data after error");
                setBooks(topBorrowedBooks);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
        
        // Debug what's in state after component mounts
        console.log("Initial books state:", books);
    }, []);

    // Debug state changes
    useEffect(() => {
        console.log("Books state updated:", books);
    }, [books]);

    // Create a default container style to ensure visibility
    const containerStyle = {
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '5px',
        margin: '10px',
        backgroundColor: '#f9f9f9',
        minHeight: '200px'
    };

    console.log("Rendering TopBooks, loading:", isLoading, "error:", error, "books:", books);

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
