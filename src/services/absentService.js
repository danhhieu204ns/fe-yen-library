import useHttpPrivate from "src/hooks/useHttpPrivate";

export const useAbsentApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllAbsentStudent = async () => {
        try {
            const res = await httpPrivate.get('/sinh-vien-vang/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAbsentStudentByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/sinh-vien-vang/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchAbsentStudent = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien-vang/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateAbsentStudentById = async (id, body) => {
        try {
            console.log(id);
            const res = await httpPrivate.put(`/sinh-vien-vang/edit/${id}`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createAbsentStudent = async (body) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien-vang/create`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const importAbsentStudent = async (body) => {
        let result;
        try {
            const res = await httpPrivate.post(`/sinh-vien-vang/import`, body);
            result = {
                status: res.status,
                message: res.data.data.message
            }
        } catch (error) {
            let res = error.response;
            result = {
                status: res.status,
                message: res.data.data.message
            } 
        }
        return result;
    }

    const deleteAbsentStudentById = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/sinh-vien-vang/delete/${id}`);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const patchDeleteAbsentStudent = async (body) => {
        try {
            const res = await httpPrivate.post('/sinh-vien-vang/delete-many', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const getAllAbsentClass = async () => {
        try {
            const res = await httpPrivate.get('/lop-vang/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAbsentClassByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/lop-vang/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchAbsentClass = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/lop-vang/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAbsentSubject = async () => {
        try {
            const res = await httpPrivate.get('/mon-hoc-vang/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAbsentSubjectByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/mon-hoc-vang/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchAbsentSubject= async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/mon-hoc-vang/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    let absentService = {
        getAllAbsentClass,
        getAllAbsentClassByPage,
        getAllAbsentStudent,
        getAllAbsentStudentByPage,
        getAllAbsentSubject,
        getAllAbsentSubjectByPage,
        createAbsentStudent,
        updateAbsentStudentById,
        deleteAbsentStudentById,
        patchDeleteAbsentStudent,
        searchAbsentClass,
        searchAbsentStudent,
        searchAbsentSubject,
        importAbsentStudent
    }

    return absentService;
}



