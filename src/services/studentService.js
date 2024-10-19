import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useStudentApi = () => {
    const httpPrivate = useHttpPrivate();
    const getAllStudent = async () => {
        try {
            const res = await httpPrivate.get('/sinh-vien/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllStudentByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/sinh-vien/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateStudentById = async (id, body) => {
        try {
            console.log(id);
            const res = await httpPrivate.put(`/sinh-vien/edit/${id}`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createStudent = async (body) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien/create`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const deleteStudentById = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/sinh-vien/delete/${id}`);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const searchStudent = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const patchDeleteStudent = async (body) => {
        try {
            const res = await httpPrivate.post('/sinh-vien/delete-many', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const crawlStudent = async () => {
        try {
            const res = await httpPrivate.get('/sinh-vien/crawl');
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let studentService = {
        getAllStudent,
        getAllStudentByPage,
        updateStudentById,
        createStudent,
        deleteStudentById,
        patchDeleteStudent,
        searchStudent,
        crawlStudent
    }
    return studentService;
}

