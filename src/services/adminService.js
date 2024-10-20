import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useAdminApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAdmin = async (id) => {
        try {
            const res = await httpPrivate.get(`/admin/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAdmin = async () => {
        try {
            const res = await httpPrivate.get('/admin/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAdminByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/admin/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchAdmin = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/admin/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateAdminById = async (id, body) => {
        try {
            console.log(id);
            const res = await httpPrivate.put(`/admin/edit/${id}`, body);
            if (res.status !== 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const createAdmin = async (body) => {
        try {
            const res = await httpPrivate.post(`/admin/register`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteAdmin = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/admin/delete/${id}`);
            if (res.status !== 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const patchDeleteAdmin = async (body) => {
        try {
            const res = await httpPrivate.post('/admin/delete-many', body);
            if (res.status !== 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const activateAdmin = async (body) => {
        try {
            const res = await httpPrivate.post('/admin/kich-hoat-tai-khoan', body);
            if (res.status !== 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deactivateAdmin = async (body) => {
        try {
            const res = await httpPrivate.post('/admin/khoa-tai-khoan', body);
            if (res.status !== 200){
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
            const res = await httpPrivate.post('/admin/reset-mat-khau', body);
            if (res.status !== 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let adminService = {
        getAdmin,
        getAllAdmin,
        getAllAdminByPage,
        createAdmin,
        updateAdminById,
        deleteAdmin,
        patchDeleteAdmin,
        resetPassword,
        activateAdmin,
        deactivateAdmin,
        searchAdmin
    };

    return adminService;
}
