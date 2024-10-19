import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useBookgroupApi = () => {
    const httpPrivate = useHttpPrivate();

    // Sách
    const oneBookgroup = async (id) => {
        try {
            const res = await httpPrivate.get(`/bookgroup/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allBookgroups = async () => {
        try {
            const res = await httpPrivate.get('/bookgroup/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const bookgroupData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/bookgroup/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createBookgroup = async (bookInfo) => {
        try {
            const res = await httpPrivate.post('/bookgroup/create', {
                ...bookInfo, // thông tin sách
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editBookgroup = async (id, bookInfo) => {
        try {
            const res = await httpPrivate.put(`/bookgroup/update/${id}`, {
                ...bookInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteBookgroup = async (id) => {
        try {
            const res = await httpPrivate.delete(`/bookgroup/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListBookgroups = async (listId) => {
        try {
            const res = await httpPrivate.delete('/bookgroup/delete-many', {
                data: { list_id: listId }  // Đảm bảo rằng body chứa một object với key là book_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        oneBookgroup,
        allBookgroups,
        bookgroupData,
        createBookgroup,
        editBookgroup,
        deleteBookgroup,
        deleteListBookgroups,
    };
};

export default useBookgroupApi;
