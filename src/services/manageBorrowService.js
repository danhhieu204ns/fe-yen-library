import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useBorrowApi = () => {
    const httpPrivate = useHttpPrivate();

    // Mượn sách
    const oneBorrow = async (id) => {
        try {
            const res = await httpPrivate.get(`/borrow/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allBorrows = async () => {
        try {
            const res = await httpPrivate.get('/borrow/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const borrowData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/borrow/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createBorrow = async (borrowInfo) => {
        try {
            const res = await httpPrivate.post('/borrow/create', {
                ...borrowInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editBorrow = async (id, borrowInfo) => {
        try {
            const res = await httpPrivate.put(`/borrow/update/${id}`, {
                ...borrowInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteBorrow = async (id) => {
        try {
            const res = await httpPrivate.delete(`/borrow/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListBorrow = async (listId) => {
        try {
            const res = await httpPrivate.delete('/borrow/delete-many', {
                data: { list_id: listId }  // Đảm bảo rằng body chứa một object với key là borrow_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        oneBorrow,
        allBorrows,
        borrowData,
        createBorrow,
        editBorrow,
        deleteBorrow,
        deleteListBorrow,
    };
};

export default useBorrowApi;