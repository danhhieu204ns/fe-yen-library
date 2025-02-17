import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useAuthorApi = () => {
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

    const authorData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/author/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
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
            const res = await httpPrivate.delete('/author/delete-many', {
                data: { list_id: listId }, // Đảm bảo rằng body chứa một object với key là author_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const importAuthor = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await httpPrivate.post('/author/import', formData, {});
            return response.data;
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
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
    };
};

export default useAuthorApi;
