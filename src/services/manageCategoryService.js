import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useCategoryApi = () => {
    const httpPrivate = useHttpPrivate();

    // Thể loại
    const oneCategory = async (id) => {
        try {
            const res = await httpPrivate.get(`/category/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allCategories = async () => {
        try {
            const res = await httpPrivate.get('/category/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllCategoryByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/category/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const importCategory = async (formData) => {
        try {
            const res = await httpPrivate.post('/category/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data;
        } catch (error) {
            // console.error('Import failed:', error);
            return error.response;
        }
    };

    const searchCategory = async (search, page, pageSize) => {
        try {
            const res = await httpPrivate.post(`/category/search?page=${page}&page_size=${pageSize}`, {
                ...search
            });
            return res?.data;
        } catch (error) {
            console.log(error);
            return {
                categories: [],
                total_data: 0
            };
        }
    }

    const createCategory = async (categoryInfo) => {
        try {
            const res = await httpPrivate.post('/category/create', {
                ...categoryInfo, // thông tin thể loại
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editCategory = async (id, categoryInfo) => {
        try {
            const res = await httpPrivate.put(`/category/update/${id}`, {
                ...categoryInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteCategory = async (id) => {
        try {
            const res = await httpPrivate.delete(`/category/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteCategoryList = async (listId) => {
        try {
            const res = await httpPrivate.delete('/category/delete-many', {
                data: { list_id: listId }  // Đảm bảo rằng body chứa một object với key là category_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const exportCategories = async () => {
        try {
            const res = await httpPrivate.get('/category/export', {
                responseType: 'blob',  // Change to blob
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

    return {
        oneCategory,
        allCategories,
        getAllCategoryByPage,
        importCategory, 
        searchCategory, 
        createCategory,
        editCategory,
        deleteCategory,
        deleteCategoryList,
        exportCategories,
    };
};

export default useCategoryApi;
