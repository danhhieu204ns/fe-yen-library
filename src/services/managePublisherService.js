import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useManagePublisherApi = () => {
    const httpPrivate = useHttpPrivate();

    const publisherData = async (page = 1, pageSize = 10) => {
        try {
            const response = await httpPrivate.get(`/publisher/pageable?page=${page}&page_size=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching publisher data:', error);
            return error;
        }
    };

    const allPublisherNames = async () => {
        try {
            const response = await httpPrivate.get('/publisher/name');
            return response.data;
        } catch (error) {
            console.error('Error fetching publisher names:', error);
            return error;
        }
    };

    const createPublisher = async (publisherInfo) => {
        try {
            const res = await httpPrivate.post('/publisher/create', publisherInfo);
            return res;
        } catch (error) {
            return error;
        }
    };

    const editPublisher = async (id, publisherInfo) => {
        try {
            const res = await httpPrivate.put(`/publisher/update/${id}`, publisherInfo);
            return res;
        } catch (error) {
            return error;
        }
    };

    const deletePublisher = async (id) => {
        try {
            const res = await httpPrivate.delete(`/publisher/delete/${id}`);
            return res.data;
        } catch (error) {
            return error?.response;
        }
    };

    const deleteListPublisher = async (listId) => {
        try {
            const response = await httpPrivate.delete('/publisher/delete-many', {
                data: { list_id: listId }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting publishers:', error);
            throw error;
        }
    };

    const importPublisher = async (formData) => {
        try {
            const response = await httpPrivate.post('/publisher/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    };

    const exportPublishers = async () => {
        try {
            const res = await httpPrivate.get('/publisher/export', {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }
            });
            return res?.data;
        } catch (error) {
            console.error('Export error:', error);
            return null;
        }
    };

    const searchPublisher = async (searchBody, page = 1, pageSize = 10) => {
        try {
            const searchData = {
                name: searchBody.name || '',
                address: searchBody.address || '',
                phone_number: searchBody.phone_number || '',
                email: searchBody.email || '',
            };
            
            const response = await httpPrivate.post(`/publisher/search?page=${page}&page_size=${pageSize}`, searchData);
            return response.data;
        } catch (error) {
            console.error('Error searching publishers:', error);
            return error;
        }
    };

    return {
        publisherData,
        allPublisherNames, 
        createPublisher,
        editPublisher, 
        deletePublisher,
        deleteListPublisher,
        importPublisher,
        exportPublishers,
        searchPublisher,
    };
};

export default useManagePublisherApi;
