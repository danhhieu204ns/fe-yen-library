import { useEffect, useState } from "react";
import { useStatsApi } from "src/services/statsService"

const TopBooks = () => {
    const [books, setBooks] = useState([]);

    const { getTopBorrowedBooks } = useStatsApi();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getTopBorrowedBooks();
            setBooks(res.data);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h2>📚 Top 5 Sách Được Mượn Nhiều Nhất</h2>
            <ul>
                {books.map((book, index) => (
                    <li key={index}>
                        {book.title} - {book.borrow_count} lượt mượn
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopBooks;
