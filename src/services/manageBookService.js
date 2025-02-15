import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useBookApi = () => {
    const httpPrivate = useHttpPrivate();

    // Sách
    const oneBook = async (id) => {
        try {
            const res = await httpPrivate.get(`/book/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllBooks = async () => {
        try {
            const res = await httpPrivate.get('/book/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const bookData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/book/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createBook = async (bookInfo) => {
        try {
            const res = await httpPrivate.post('/book/create', {
                ...bookInfo, // thông tin sách
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editBook = async (id, bookInfo) => {
        try {
            const res = await httpPrivate.put(`/book/update/${id}`, {
                ...bookInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteBook = async (id) => {
        try {
            const res = await httpPrivate.delete(`/book/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListBooks = async (listId) => {
        try {
            const res = await httpPrivate.delete('/book/delete-many', {
                data: { list_id: listId }  // Đảm bảo rằng body chứa một object với key là book_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };
    const checkBook = async (formData) => {
        try {
            const res = await httpPrivate.post('/book/check', formData, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                }, });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    return {
        oneBook,
        getAllBooks,
        bookData,
        createBook,
        editBook,
        deleteBook,
        deleteListBooks,
        checkBook
    };
};

export default useBookApi;
