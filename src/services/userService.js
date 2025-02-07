import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useUserApi = () => {
    const httpPrivate = useHttpPrivate();


    const getUser = async (id) => {
        try {
            const res = await httpPrivate.get(`'/user/${id}'`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUser = async () => {
        try {
            const res = await httpPrivate.get('/user/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUserByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/user/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchUser = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/user/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserById = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/user/update/${id}`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createUser = async (formData) => {
        try {
            const res = await httpPrivate.post(`/user/register`, formData);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/user/delete/${id}`);
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
            const res = await httpPrivate.post('/user/delete-many', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const activateUser = async (user_id) => {
        try {
            const res = await httpPrivate.post(`/user/kich_hoat_tai_khoan/${user_id}`);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deactivateUser = async (user_id) => {
        try {
            const res = await httpPrivate.post(`/user/khoa_tai_khoan/${user_id}`);
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
            const res = await httpPrivate.post('/user/re_pwd', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    const checkUser = async (formData) => {
        try {
            const res = await httpPrivate.post(`/user/check`, formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    let userService = {
        getUser,
        getAllUser,
        getAllUserByPage,
        createUser,
        updateUserById,
        deleteUser,
        patchDeleteUser,
        resetPassword,
        activateUser,
        deactivateUser,
        searchUser,
        checkUser
    }

    return userService;
}




