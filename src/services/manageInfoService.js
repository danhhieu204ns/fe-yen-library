import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useManageInfoApi = () => {
    const httpPrivate = useHttpPrivate();

    // school year
    const oneSchoolYear = async (id) => {
        try {
            const res = await httpPrivate.get(`/nam-hoc/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allSchoolYear = async () => {
        try {
            const res = await httpPrivate.get('/nam-hoc/all/');
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const schoolYearData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get('/nam-hoc/pageable/', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createSchoolYear = async (startYear) => {
        try {
            const res = await httpPrivate.post('/nam-hoc/create', {
                start_year: startYear,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editSchoolYear = async (id, startYear) => {
        try {
            const res = await httpPrivate.put(`/nam-hoc/edit/${id}`, {
                start_year: startYear,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteSchoolYear = async (id) => {
        try {
            const res = await httpPrivate.delete(`/nam-hoc/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListShoolYear = async (listId) => {
        try {
            const res = await httpPrivate.post('/nam-hoc/delete-many', {
                list_id: listId,
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    // semester
    const oneSemester = async (id) => {
        try {
            const res = await httpPrivate.get(`/ky-hoc/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const semesterData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get('/ky-hoc/pageable/', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createSemester = async (body) => {
        try {
            const res = await httpPrivate.post('/ky-hoc/create', {
                school_year_id: body.schoolYearId,
                semester_number: body.semesterNumber,
                current_semester: body.currentSemester,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const editSemester = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/ky-hoc/edit/${id}`, {
                school_year_id: body.schoolYearId,
                semester_number: body.semesterNumber,
                current_semester: body.currentSemester,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteSemester = async (id) => {
        try {
            const res = await httpPrivate.delete(`/ky-hoc/delete/${id}`);
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const allSubjectInSemester = async (id) => {
        try {
            const res = await httpPrivate.get(`/ky-hoc/${id}/mon-hoc`);
            return res.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const addSubjectToSemester = async (semesterId, listSubjectId) => {
        try {
            const res = await httpPrivate.put(`/ky-hoc/${semesterId}/them-mon-hoc`, {
                list_subject_id: listSubjectId,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListSubjectInSemester = async (semesterId, listSubjectId) => {
        try {
            const res = await httpPrivate.put(`/ky-hoc/${semesterId}/xoa-mon-hoc`, {
                list_subject_id: listSubjectId,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListSemester = async (listSemesterId) => {
        try {
            const res = await httpPrivate.post('/ky-hoc/delete-many', {
                list_id: listSemesterId,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const syncStudent = async (semesterId) => {
        try {
            const res = await httpPrivate.get(`/ky-hoc/dong-bo-danh-sach-dong-hoc-phi/${semesterId}`);
            return res?.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    // grade
    const getGrade = async (id) => {
        try {
            const res = await httpPrivate.get(`/khoa/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allGrade = async () => {
        try {
            const res = await httpPrivate.get('/khoa/all/');
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allGradePageable = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get('/khoa/pageable/', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createGrade = async (body) => {
        try {
            const res = await httpPrivate.post('/khoa/create', {
                number: +body.number,
                color_code: body.colorCode,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editGrade = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/khoa/edit/${id}`, {
                number: +body.number,
                color_code: body.colorCode,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteGrade = async (id) => {
        try {
            const res = await httpPrivate.delete(`/khoa/delete/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListGrade = async (listGradeId) => {
        try {
            const res = await httpPrivate.post('/khoa/delete-many', {
                list_id: listGradeId,
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    // class
    const getClass = async (id) => {
        try {
            const res = await httpPrivate.get(`/lop/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allClassPageable = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get('/lop/pageable/', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createClass = async (body) => {
        try {
            const res = await httpPrivate.post('/lop/create', {
                student_cohort_id: body.studentCohortId,
                class_name: body.className,
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const editClass = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/lop/edit/${id}`, {
                student_cohort_id: body.studentCohortId,
                class_name: body.className,
            });
            return res?.data?.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteClass = async (id) => {
        try {
            const res = await httpPrivate.delete(`/lop/delete/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const listStudentsInClass = async (classId) => {
        try {
            const res = await httpPrivate.get(`/danh-sach-sinh-vien/${classId}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteListClass = async (listClassId) => {
        try {
            const res = await httpPrivate.post('/lop/delete-many', {
                list_id: listClassId,
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    // subject
    const getSubject = async (id) => {
        try {
            const res = await httpPrivate.get(`/mon-hoc/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allSubject = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get('/mon-hoc/all/', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allSubjectPageable = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get('/mon-hoc/pageable/', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createSubject = async (body) => {
        try {
            const res = await httpPrivate.post('/mon-hoc/create', {
                subject_code: body.subjectCode,
                subject_name: body.subjectName,
                number_study_credits: body.numberStudyCredits, // số tín chỉ
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const editSubject = async (id, body) => {
        try {
            const res = await httpPrivate.put(`/mon-hoc/edit/${id}`, {
                subject_code: body.subjectCode,
                subject_name: body.subjectName,
                number_study_credits: body.numberStudyCredits,
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteSubject = async (id) => {
        try {
            const res = await httpPrivate.delete(`/mon-hoc/delete/${id}`);
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListSubject = async (listSubjectId) => {
        try {
            const res = await httpPrivate.post('/mon-hoc/delete-many', {
                list_id: listSubjectId,
            });
            return res?.data.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        oneSchoolYear,
        allSchoolYear,
        schoolYearData,
        createSchoolYear,
        editSchoolYear,
        deleteSchoolYear,
        deleteListShoolYear,
        oneSemester,
        semesterData,
        createSemester,
        editSemester,
        deleteSemester,
        allSubjectInSemester,
        addSubjectToSemester,
        deleteListSubjectInSemester,
        deleteListSemester,
        syncStudent,
        getGrade,
        allGrade,
        allGradePageable,
        createGrade,
        editGrade,
        deleteGrade,
        deleteListGrade,
        getClass,
        allClassPageable,
        createClass,
        editClass,
        deleteClass,
        listStudentsInClass,
        deleteListClass,
        getSubject,
        allSubject,
        allSubjectPageable,
        createSubject,
        editSubject,
        deleteSubject,
        deleteListSubject,
    };
};

export default useManageInfoApi;
