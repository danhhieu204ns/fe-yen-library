import useHttpPrivate from "src/hooks/useHttpPrivate";

export const useBookshelfApi = () => {

    const httpPrivate = useHttpPrivate();

    const getAllBookshelfs = async () => {
        try {
            const res = await httpPrivate.get('/bookshelf/all');
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    };

    const getBookshelf = async (id) => {
        try {
            const res = await httpPrivate.get(`/bookshelf/${id}`);
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const getBookshelfByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/bookshelf/pageable?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const bookshelfName = async () => {
        try {
            const res = await httpPrivate.get('/bookshelf/name');
            return res;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const createBookshelf = async (bookshelf) => {
        try {
            const res = await httpPrivate.post('/bookshelf/create', {
                ...bookshelf,
            });
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const updateBookshelf = async (id, bookshelf) => {
        try {
            const res = await httpPrivate.put(`/bookshelf/update/${id}`, {
                ...bookshelf,
            });
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const deleteBookshelf = async (id) => {
        try {
            const res = await httpPrivate.delete(`/bookshelf/delete/${id}`);
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const deleteListBookshelf = async (ids) => {
        try {
            const res = await httpPrivate.delete(`/bookshelf/delete-many`, {data: {ids: ids}});
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const searchBookshelf = async (search, page, page_size) => {
        try {
            const res = await httpPrivate.get(`/bookshelf/search?page=${page}&page_size=${page_size}`, {
                ...search,
            });
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    }

    const importBookshelf = async (formData) => {
        try {
            const response = await httpPrivate.post('/bookshelf/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response
        } catch (error) {
            return error.response;
        }
    };

    const exportBookshelf = async () => {
        try {
            const res = await httpPrivate.get('/bookshelf/export', {
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

    let bookshelfService = {
        getAllBookshelfs, 
        getBookshelf, 
        getBookshelfByPage,
        bookshelfName, 
        createBookshelf,
        updateBookshelf,
        deleteBookshelf,
        deleteListBookshelf,
        searchBookshelf,
        importBookshelf,
        exportBookshelf,
    };

    return bookshelfService; 
}

export default useBookshelfApi;

