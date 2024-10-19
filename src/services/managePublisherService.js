import useHttpPrivate from 'src/hooks/useHttpPrivate';

const usePublisherApi = () => {
    const httpPrivate = useHttpPrivate();

    // Nhà xuất bản
    const onePublisher = async (id) => {
        try {
            const res = await httpPrivate.get(`/publisher/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allPublishers = async () => {
        try {
            const res = await httpPrivate.get('/publisher/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const publisherData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/publisher/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createPublisher = async (publisherInfo) => {
        try {
            const res = await httpPrivate.post('/publisher/create', {
                ...publisherInfo, // thông tin nhà xuất bản
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editPublisher = async (id, publisherInfo) => {
        try {
            const res = await httpPrivate.put(`/publisher/update/${id}`, {
                ...publisherInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deletePublisher = async (id) => {
        try {
            const res = await httpPrivate.delete(`/publisher/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListPublishers = async (listId) => {
        try {
            const res = await httpPrivate.delete('/publisher/delete-many', {
                data: { list_id: listId }  // Đảm bảo rằng body chứa một object với key là publisher_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        onePublisher,
        allPublishers,
        publisherData,
        createPublisher,
        editPublisher,
        deletePublisher,
        deleteListPublishers,
    };
};

export default usePublisherApi;
