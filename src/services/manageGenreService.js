import useHttpPrivate from 'src/hooks/useHttpPrivate';

const useGenreApi = () => {
    const httpPrivate = useHttpPrivate();

    // Thể loại
    const oneGenre = async (id) => {
        try {
            const res = await httpPrivate.get(`/genre/${id}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const allGenres = async () => {
        try {
            const res = await httpPrivate.get('/genre/all');
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const genreData = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/genre/pageable?page=${page}&page_size=${pageSize}`);
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createGenre = async (genreInfo) => {
        try {
            const res = await httpPrivate.post('/genre/create', {
                ...genreInfo, // thông tin thể loại
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const editGenre = async (id, genreInfo) => {
        try {
            const res = await httpPrivate.put(`/genre/update/${id}`, {
                ...genreInfo,
            });
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const deleteGenre = async (id) => {
        try {
            const res = await httpPrivate.delete(`/genre/delete/${id}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    const deleteListGenres = async (listId) => {
        try {
            const res = await httpPrivate.delete('/genre/delete-many', {
                data: { list_id: listId }  // Đảm bảo rằng body chứa một object với key là genre_ids
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error?.response;
        }
    };

    return {
        oneGenre,
        allGenres,
        genreData,
        createGenre,
        editGenre,
        deleteGenre,
        deleteListGenres,
    };
};

export default useGenreApi;
