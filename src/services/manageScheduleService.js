import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useScheduleApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllSchedule = async () => {
        try {
            const res = await httpPrivate.get('/lich-giang-day/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllScheduleByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/lich-giang-day/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateSchedule = async (id, body) => {
        try {
            console.log(id);
            const res = await httpPrivate.put(`/lich-giang-day/edit/${id}`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createSchedule = async (body) => {
        try {
            const res = await httpPrivate.post(`/lich-giang-day/create`, body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const deleteScheduleById = async (id) => {
        try {
            console.log(id);
            const res = await httpPrivate.delete(`/lich-giang-day/delete/${id}`);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const patchDeleteSchedule = async (body) => {
        try {
            const res = await httpPrivate.post('/lich-giang-day/delete-many', body);
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const searchSchedule = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/lich-giang-day/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchLecturer = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/giang-vien/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const importSchedule = async (body) => {
        let result;
        try {
            const res = await httpPrivate.post(`/lich-giang-day/import`, body);
            result = {
                status: res?.status,
                message: res?.data.data.message
            }
        } catch (error) {
            let res = error.response;
            result = {
                status: res?.status,
                message: res?.data.data.message
            } 
        }
        return result;
    }

    let scheduleService = {
        getAllSchedule,
        getAllScheduleByPage,
        createSchedule,
        updateSchedule,
        deleteScheduleById,
        patchDeleteSchedule,
        searchSchedule,
        searchLecturer,
        importSchedule
    }

    return scheduleService;
}

