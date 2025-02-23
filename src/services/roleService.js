import useHttpPrivate from "src/hooks/useHttpPrivate";

export const useRoleApi = () => {

    const httpPrivate = useHttpPrivate();

    const getRoleNames = async () => {
        try {
            const res = await httpPrivate.get('/role/name');
            return res.data;
        } catch (error) {
            console.error('Get roles error:', error);
            return [];
        }
    };

    let roleService = {
        getRoleNames
    };

    return roleService; 
}

export default useRoleApi;

