import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useDashboardApi = () => {
    const httpPrivate = useHttpPrivate();

    // sach theo
    const absenceByClassData = async (date) => {
        try {
            const res = await httpPrivate.post('/dashboard/sinh-vien-vang/lop', date);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const listgroupbook = async (id) => {
        try {
            const res = await httpPrivate.get("/bookgroup/all");
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    // sinh vien vang theo mon hoc
    const allSubjectInSemester = async () => {
        try {
            const res = await httpPrivate.get('/mon-hoc/ky-hien-tai/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const absenceBySubjectData = async (subjectId) => {
        try {
            const res = await httpPrivate.post(`/dashboard/sinh-vien-vang/mon-hoc-v2`, { subject_id: subjectId });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const studentsAbsenceBySubject = async (listIdStudents) => {
        try {
            const res = await httpPrivate.post(`/dashboard/sinh-vien-vang/mon-hoc-v2/chi-tiet`, {
                list_id: listIdStudents,
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    // hoc phi
    const studentTuitionByClassData = async () => {
        try {
            const res = await httpPrivate.get('/dashboard/hoc-phi/lop');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const listStudentTuitionFee = async (id) => {
        try {
            const res = await httpPrivate.get(`/danh-sach-sinh-vien-chua-dong-hoc-phi/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        absenceByClassData,
        listgroupbook,
        allSubjectInSemester,
        absenceBySubjectData,
        studentsAbsenceBySubject,
        studentTuitionByClassData,
        listStudentTuitionFee,
    };
};

export default useDashboardApi;
