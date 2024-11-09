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

    const getBorrowsByUser = async () => {
        try {
            const res = await httpPrivate.get(`/borrow/by-user`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getBorrowsWithUserID = async (user_id) => {
        try {
            const res = await httpPrivate.get(`/borrow/with-user-id/${user_id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getBorrowsWithUserIDAndBookID = async (form) => {
        try {
            const res = await httpPrivate.post(`/borrow/with-user-id-and-book-id`, form);
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

    const createBorrowByUser = async (borrowInfo) => {
        try {
            const res = await httpPrivate.post('/borrow/create/by_user', {
                ...borrowInfo,
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };


    const createBorrow = async (borrowInfo) => {
        try {
            const res = await httpPrivate.post('/borrow/create/by_admin', {
                ...borrowInfo,
            });
            return res.data;
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

    const cancelBorrow = async (id) => {
        try {
            const res = await httpPrivate.put(`/borrow/cancel/${id}`);
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    
    const returnBorrow = async (id) => {
        try {
            const res = await httpPrivate.put(`/borrow/return/${id}`);
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
        getBorrowsByUser,
        getBorrowsWithUserID,
        getBorrowsWithUserIDAndBookID,
        borrowData,
        createBorrowByUser, 
        createBorrow,
        editBorrow,
        cancelBorrow,
        returnBorrow,
        deleteBorrow,
        deleteListBorrow,
    };
};

export default useBorrowApi;
