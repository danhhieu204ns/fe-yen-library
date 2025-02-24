import useHttpPrivate from "src/hooks/useHttpPrivate";

export const useBookCopyApi = () => {

    const httpPrivate = useHttpPrivate();

    const getAllBookCopy = async () => {
        try {
            const res = await httpPrivate.get('/book-copy/all');
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    };

    const getBookCopy = async (id) => {
        try {
            const res = await httpPrivate.get(`/book-copy/${id}`);
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const getBookCopyByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/book-copy/pageable?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const createBookCopy = async (bookCopy) => {
        try {
            const res = await httpPrivate.post('/book-copy/create', {
                ...bookCopy,
            });
            return res;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const updateBookCopy = async (id, bookCopy) => {
        try {
            const res = await httpPrivate.put(`/book-copy/update/${id}`, {
                ...bookCopy,
            });
            return res;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const deleteBookCopy = async (id) => {
        try {
            const res = await httpPrivate.delete(`/book-copy/delete/${id}`);
            return res;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const deleteListBookCopy = async (ids) => {
        try {
            const res = await httpPrivate.delete(`/book-copy/delete-many`, {data: {ids: ids}});
            return res;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const searchBookCopy = async (search, page, page_size) => {
        try {
            const res = await httpPrivate.get(`/book-copy/search?page=${page}&page_size=${page_size}`, {
                ...search,
            });
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const importBookCopy = async (formData) => {
        try {
            const response = await httpPrivate.post('/book-copy/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response
        } catch (error) {
            return error.response;
        }
    };

    const exportBookCopy = async () => {
        try {
            const res = await httpPrivate.get('/book-copy/export', {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }
            });
            return res;
        } catch (error) {
            console.error('Export error:', error);
            return null;
        }
    };

    let bookCopyService = {
        getAllBookCopy,
        getBookCopy,
        getBookCopyByPage,
        createBookCopy,
        updateBookCopy,
        deleteBookCopy,
        deleteListBookCopy,
        searchBookCopy,
        importBookCopy,
        exportBookCopy,
    };

    return bookCopyService; 
}

export default useBookCopyApi;

