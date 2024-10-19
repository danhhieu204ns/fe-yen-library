import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useManageLecturerApi = () => {
    const httpPrivate = useHttpPrivate();

    const getLecturer = async (id) => {
        try {
            const res = await httpPrivate.get(`/giang-vien/${id}`);
            return res?.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllLecturer = async () => {
        try {
            const res = await httpPrivate.get('/giang-vien/all/');
            return res?.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllLecturerByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/giang-vien/pageable/`, {
                params: {
                    page: page,
                    page_size: pageSize,
                },
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchLecturer = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/giang-vien/search/multikey`, body, {
                params: {
                    page: page,
                    page_size: pageSize,
                },
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createLecturer = async (body) => {
        try {
            const res = await httpPrivate.post('/giang-vien/create', {
                lecturer_name: body.lecturerName,
                hoc_ham_hoc_vi: body.hocHamHocVi,
                phone_number: body.phoneNumber,
                email: body.email,
                ch_tg: body.chTg,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const editLecturer = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/giang-vien/edit/${id}`, {
                lecturer_name: body.lecturerName,
                hoc_ham_hoc_vi: body.hocHamHocVi,
                phone_number: body.phoneNumber,
                email: body.email,
                ch_tg: body.chTg,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteLecturer = async (id) => {
        try {
            const res = await httpPrivate.delete(`/giang-vien/delete/${id}`);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteLecturerList = async (listId) => {
        try {
            const res = await httpPrivate.post(`/giang-vien/delete-many`, {
                list_id: listId,
            });
            return res?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        getLecturer,
        getAllLecturer,
        getAllLecturerByPage,
        searchLecturer,
        createLecturer,
        editLecturer,
        deleteLecturer,
        deleteLecturerList,
    };
};

export default useManageLecturerApi;
