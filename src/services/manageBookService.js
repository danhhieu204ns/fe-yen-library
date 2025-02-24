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

    const bookName = async () => {
        try {   
            const res = await httpPrivate.get('/book/name');
            return res;
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
            return res; // Trả về toàn bộ response, không chỉ data
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListBooks = async (listId) => {
        try {
            const res = await httpPrivate.delete('/book/delete-many', {
                data: { ids: listId }  // Đảm bảo rằng body chứa một object với key là book_ids
            });
            return res; // Trả về toàn bộ response
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const searchBook = async (search, page, page_size) => {
        try {
            const res = await httpPrivate.get(`/book/search?page=${page}&page_size=${page_size}`, 
                { ...search}
            );
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const importBook = async (formData) => {
        try {
            const res = await httpPrivate.post('/book/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            // Return entire response để kiểm tra đầy đủ
            return res;
        } catch (error) {
            console.log('Import error in service:', error);
            // Return error response để kiểm tra lỗi
            return error?.response;
        }
    };

    const exportBook = async (file) => {
        try {
            const res = await httpPrivate.post('/book/export', file);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const downloadTemplate = async () => {
        try {
            const res = await httpPrivate.get('/book/template', {
                responseType: 'arraybuffer'
            });
            return res;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const exportBooks = async () => {
        try {
            const res = await httpPrivate.get('/book/export', {
                responseType: 'blob'
            });
            return res;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        oneBook,
        getAllBooks,
        bookData,
        bookName,
        createBook,
        editBook,
        deleteBook,
        deleteListBooks,
        searchBook,
        importBook,
        exportBook,
        downloadTemplate,
        exportBooks,
    };
};

export default useBookApi;
