import useHttpPrivate from 'src/hooks/useHttpPrivate';

export const useRetakeApi = () => {
    const httpPrivate = useHttpPrivate();
    const getAllRetake = async () => {
        try {
            const res = await httpPrivate.get('/sinh-vien-hoc-lai/all/');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllRetakeByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/sinh-vien-hoc-lai/pageable/?page=${page}&page_size=${pageSize}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const searchRetake = async (body, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/sinh-vien-hoc-lai/search/multikey?page=${page}&page_size=${pageSize}`, body);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const crawlRetake = async () => {
        try {
            const res = await httpPrivate.get('/hoc-lai/crawl');
            if (res.status != 200){
                throw(res.data);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let retakeService = {
        getAllRetake,
        getAllRetakeByPage,
        searchRetake,
        crawlRetake
    }
    return retakeService;
}

