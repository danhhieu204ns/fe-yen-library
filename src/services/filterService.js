import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useFilterApi = () => {
    const httpPrivate = useHttpPrivate();

    const getSubjectInSemester = async (body) => {
        try {
            const res = await httpPrivate.post('/mon-hoc/trong-danh-sach-ky', body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getClassInCohort = async (body) => {
        try {
            const res = await httpPrivate.post('/lop/trong-danh-sach-khoa', body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllSubject = async () => {
        try {
            const res = await httpPrivate.get('/mon-hoc/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllSemester = async () => {
        try {
            const res = await httpPrivate.get('/ky-hoc/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllClass = async () => {
        try {
            const res = await httpPrivate.get('/lop/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllCohort = async () => {
        try {
            const res = await httpPrivate.get('/khoa/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllLecturer = async () => {
        try {
            const res = await httpPrivate.get('/giang-vien/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    let filterService = {
        getAllClass,
        getAllCohort,
        getAllLecturer,
        getAllSemester,
        getAllSubject,
        getClassInCohort,
        getSubjectInSemester
    }

    return filterService;
}

