import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useManageAuthorApi = () => {
    const httpPrivate = useHttpPrivate();

    // Tác giả
    const oneAuthor = async (id) => {
        try {
            const res = await httpPrivate.get(`/author/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allAuthors = async () => {
        try {
            const res = await httpPrivate.get('/author/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const authorData = async (page = 1, pageSize = 10) => {
        try {
            const response = await httpPrivate.get(`/author/pageable?page=${page}&page_size=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching author data:', error);
            return error;
        }
    };

    const createAuthor = async (authorInfo) => {
        try {
            const res = await httpPrivate.post('/author/create', {
                ...authorInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editAuthor = async (id, authorInfo) => {
        try {
            const res = await httpPrivate.put(`/author/update/${id}`, {
                ...authorInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteAuthor = async (id) => {
        try {
            const res = await httpPrivate.delete(`/author/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListAuthor = async (listId) => {
        try {
            const response = await httpPrivate.delete('/author/delete-many', {
                data: { list_id: listId }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting authors:', error);
            throw error;
        }
    };

    const importAuthor = async (formData) => {
        try {
            const response = await httpPrivate.post('/author/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data
        } catch (error) {
            return error.response;
        }
    };

    const exportAuthors = async () => {
        try {
            const res = await httpPrivate.get('/author/export', {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }
            });
            return res?.data;
        } catch (error) {
            console.error('Export error:', error);
            return null;
        }
    };

    return {
        oneAuthor,
        allAuthors,
        authorData,
        createAuthor,
        editAuthor,
        deleteAuthor,
        deleteListAuthor,
        importAuthor,
        exportAuthors,
    };
};

export default useManageAuthorApi;
