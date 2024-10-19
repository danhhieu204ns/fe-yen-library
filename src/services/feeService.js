import useHttpPrivate from "src/hooks/useHttpPrivate";

export const useFeeApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllStudentFee = async () => {
        try {
            const res = await httpPrivate.get('/sinh-vien-hoc-phi/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllStudentFeeByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/sinh-vien-hoc-phi/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchStudentFee = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien-hoc-phi/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateStudentFeeById = async (id, body) => {
        try {
            console.log(id);
            const res = await httpPrivate.put(`/sinh-vien-hoc-phi/edit/${id}`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createStudentFee= async (body) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien-hoc-phi/create`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const deleteStudentFeeById = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/sinh-vien-hoc-phi/delete/${id}`);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const patchDeleteStudentFee = async (body) => {
        try {
            const res = await httpPrivate.post('/sinh-vien-hoc-phi/delete-many', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const importPaidStudent = async (body) => {
        let result;
        try {
            const res = await httpPrivate.post(`/sinh-vien-hoc-phi/import`, body);
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

    const getAllClassFee = async () => {
        try {
            const res = await httpPrivate.get('/hoc-phi-theo-lop/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllClassFeeByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/hoc-phi-theo-lop/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllStudentInClassFee = async (id) => {
        try {
            const res = await httpPrivate.get(`/hoc-phi-theo-lop/danh-sach-sinh-vien/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchClassFee = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/hoc-phi-theo-lop/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };    

    let feeService = {
        getAllClassFee,
        getAllClassFeeByPage,
        getAllStudentFee,
        getAllStudentFeeByPage,
        getAllStudentInClassFee,
        createStudentFee,
        updateStudentFeeById,
        deleteStudentFeeById,
        patchDeleteStudentFee,
        searchClassFee,
        searchStudentFee,
        importPaidStudent
    }

    return feeService;
}

