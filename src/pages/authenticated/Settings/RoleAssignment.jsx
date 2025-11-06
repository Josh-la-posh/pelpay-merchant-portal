import { useEffect, useState } from 'react'
import useAuth from '@/services/hooks/useAuth';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import RoleService from '@/services/api/rolesApi';
import { useDispatch, useSelector } from 'react-redux';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import { useParams } from 'react-router-dom';
import RoleAssignmentTable from './component/RoleAssignmentTable';

function RoleAssignment() {
    const { id } = useParams();
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const { userRoles, userRolesLoading, userRolesError } = useSelector((state) => state.roles);
    const [filteredData, setFilteredData] = useState(userRoles);
    const [isUserRoleLoading, setIsUserRoleLoading] = useState(userRolesLoading);
    const [errMsg, setErrMsg] = useState(userRolesError);
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const merchantCode = auth?.merchant?.merchantCode;
    const roleService = new RoleService(axiosPrivate, auth);

    useEffect(() => {
        setSettingsTitle('Teams');
    }, []);

    useEffect(() => {
        setFilteredData(userRoles);
    }, [userRoles]);
    
    useEffect(() => {
        setIsUserRoleLoading(userRolesLoading);
    }, [userRolesLoading]);
    
    useEffect(() => {
        setErrMsg(userRolesError);
    }, [userRolesError]);

    // useEffect(() => {
    //     setPermissionLists(permissionLists);
    // }, [permissionLists]);            
                
    useEffect(() => {
        loadUserRoles();
    }, []);

    const handleRefresh = () => {
        loadUserRoles();
    }
    
    // const handleOptionRefresh = () => {
    //     loadPermissions();
    // }
    
    // const loadPermissions = async () => {
    //     if (id) {
    //         await permissionService.fetchRolePermission(roleId, aggregatorCode, dispatch);
    //     }
    // };
    
    const loadUserRoles = async () => {
        if (id) {
            await roleService.fetchRolesByUserId(id,  aggregatorCode, dispatch);
        }
    }; 

    return (
        <RoleAssignmentTable
            filteredData={filteredData}
            errMsg={errMsg}
            handleRefresh={handleRefresh}
            // permissionLists={permissionLists}
            isUserRoleLoading={isUserRoleLoading}
            // handleOptionRefresh={handleOptionRefresh}
        />
    );
}

export default RoleAssignment;