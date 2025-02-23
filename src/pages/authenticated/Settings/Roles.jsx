import React, { useEffect, useState } from 'react'
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import RoleService from '@/services/api/rolesApi';
import { useDispatch, useSelector } from 'react-redux';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';
import RoleManagementTable from './component/RoleManagementTable';

function RolesAndPermission() {
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const { roles, rolesLoading, rolesError } = useSelector((state) => state.roles);
    const [filteredData, setFilteredData] = useState(roles);
    const [isLoading, setIsLoading] = useState(rolesLoading);
    const [errMsg, setErrMsg] = useState(rolesError);
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const merchantCode = auth?.merchant?.merchantCode;
    const roleService = new RoleService(axiosPrivate, auth);

    useEffect(() => {
        setSettingsTitle('Roles');
    }, []);

    useEffect(() => {
        setFilteredData(roles);
    }, [roles]);
                
    useEffect(() => {
        setIsLoading(rolesLoading);
    }, [rolesLoading]);
        
    useEffect(() => {
        setErrMsg(rolesError);
    }, [rolesError]);

    useEffect(() => {
        console.log(auth)
        loadData();
    }, [aggregatorCode, merchantCode, dispatch]);

    const handleRefresh = () => {
        loadData();
    }
    
    const loadData = async () => {
        if (merchantCode) {
        await roleService.fetchRoles(aggregatorCode, merchantCode, dispatch);
        }
    };

    if (isLoading) return (
        <div className='h-[80vh] w-full'>
            <Spinner />
        </div>
    );

    if (errMsg !== null) return (
        <div className='h-[40vh] w-full'>
            <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />
        </div>
    );

    return (
        <RoleManagementTable filteredData={filteredData}/>
    );
}

export default RolesAndPermission;