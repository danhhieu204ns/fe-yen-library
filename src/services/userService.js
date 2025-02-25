import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useUserApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllUser = async () => {
        try {
            const res = await httpPrivate.get('/user/all');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUserByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/user/pageable?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async (id) => {
        try {
            const res = await httpPrivate.get(`/user/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchUser = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/user/search?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.error('Search error:', error.response?.data || error);
            throw error; // Propagate error to component for handling
        }
    };

    const updateUserById = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/user/update/${id}`, body);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    const registerUser = async (formData) => {
        try {
            const res = await httpPrivate.post(`/user/register`, formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const createUser = async (formData) => {
        try {
            const res = await httpPrivate.post(`/user/create-account`, formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async (id) => {
        try {
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

    const deleteListUsers = async (body) => {
        try {
            const res = await httpPrivate.delete('/user/delete_many', {
                data: { list_id: body }
            });
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.error('Delete many error:', error.response?.data || error);
            return false;
        }
    };

    const activateUser = async (user_id) => {
        try {
            const res = await httpPrivate.post(`/user/activate/${user_id}`);
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
            const res = await httpPrivate.post(`/user/deactivate/${user_id}`);
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

    const importUser = async (formData) => {
        try {
            const res = await httpPrivate.post('/user/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const exportUser = async () => {
        try {
            const res = await httpPrivate.get('/user/export', {
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
    }

    let userService = {
        getUser,
        getAllUser,
        getAllUserByPage,
        registerUser,
        createUser,
        updateUserById,
        deleteUser,
        deleteListUsers,  
        resetPassword,
        activateUser,
        deactivateUser,
        searchUser,
        importUser,
        exportUser
    }

    return userService;
}




