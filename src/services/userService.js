import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useUserApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllUser = async () => {
        try {
            const res = await httpPrivate.get('/nguoi-dung/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUserByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/nguoi-dung/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchUser = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/nguoi-dung/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserById = async (id, body) => {
        try {
            console.log(id);
            const res = await httpPrivate.put(`/nguoi-dung/edit/${id}`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createUser = async (body) => {
        try {
            const res = await httpPrivate.post(`/user/register`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/nguoi-dung/delete/${id}`);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const patchDeleteUser = async (body) => {
        try {
            const res = await httpPrivate.post('/nguoi-dung/delete-many', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const activateUser = async (body) => {
        try {
            const res = await httpPrivate.post('/nguoi-dung/kich-hoat-tai-khoan', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deactivateUser = async (body) => {
        try {
            const res = await httpPrivate.post('/nguoi-dung/khoa-tai-khoan', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const resetPassword = async (body) => {
        try {
            const res = await httpPrivate.post('/nguoi-dung/reset-mat-khau', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let userService = {
        getAllUser,
        getAllUserByPage,
        createUser,
        updateUserById,
        deleteUser,
        patchDeleteUser,
        resetPassword,
        activateUser,
        deactivateUser,
        searchUser
    }

    return userService;
}




