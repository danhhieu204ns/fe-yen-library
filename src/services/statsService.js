import useHttpPrivate from "src/hooks/useHttpPrivate";

export const useStatsApi = () => {

    const httpPrivate = useHttpPrivate();

    const getLibraryStats = async () => {
        try {
            const res = await httpPrivate.get('/stats/');
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    const getMonthlyBorrowingStats = async () => {
        try {
            const res = await httpPrivate.get('/stats/monthly');
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    const getTopBorrowedBooks = async () => {
        try {
            const res = await httpPrivate.get('/stats/top-books');
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    const getBookByCategory = async () => {
        try {
            const res = await httpPrivate.get('/stats/books/by-category');
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    const getBookStatus = async () => {
        try {
            const res = await httpPrivate.get('/stats/books/status');
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    let statsService = {
        getLibraryStats, 
        getMonthlyBorrowingStats, 
        getTopBorrowedBooks,
        getBookByCategory,
        getBookStatus
    };

    return statsService; 
}

export default useStatsApi;