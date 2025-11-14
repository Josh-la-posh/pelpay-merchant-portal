import { useEffect, useState, useCallback, useMemo } from 'react'
import useAuth from '@/services/hooks/useAuth';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import PermissionService from '@/services/api/permissionApi';
import { useDispatch, useSelector } from 'react-redux';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import ManagePermissionTable from './component/ManagePermissionTable';
import { useParams } from 'react-router-dom';

function ManagePermission() {
    const { id } = useParams();
    console.log("manage permission role id:", id);
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const { permissions,  aggregatorPermissionsTotalSize, aggregatorPermissions, permissionsLoading, aggregatorPermissionsLoading, permissionsError, aggregatorPermissionsError } = useSelector((state) => state.permissions);
    // const [permissionLists, setPermissionLists] = useState(permissions);
    const [permissionLists, setPermissionLists] = useState(aggregatorPermissions);
    // console.log('Permissions in ManagePermission:', permissionLists);
    // console.log('Permissions in Aggregator ManagePermission:', aggregatorPermissions);
    // const [filteredData, setFilteredData] = useState(aggregatorPermissions);
    const [filteredData, setFilteredData] = useState(permissions);
    const [isAggregatorPermissionsLoading, setIsAggregatorPermissionsLoading] = useState(aggregatorPermissionsLoading);
    const [, setIsPermissionsLoading] = useState(permissionsLoading);
    const [errMsg, setErrMsg] = useState(permissionsError);
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const permisssionService = useMemo(() => new PermissionService(axiosPrivate, auth), [axiosPrivate, auth]);
    const [totalSize, setTotalSize] = useState(aggregatorPermissionsTotalSize);
    const pageNumber = 1;
    const pageSize = 40;


    useEffect(() => {
        setSettingsTitle('Roles');
    }, [setSettingsTitle]);


     const handleRefresh = () => {
        loadAggregatorPermissions();
    }
    
    const handleOptionRefresh = () => {
        loadPermissions();
    }
    
    const loadPermissions = useCallback(async () => {
        if (id) {
            await permisssionService.fetchRolePermission(id, aggregatorCode, dispatch);
        }
    }, [id, permisssionService, aggregatorCode, dispatch]);

    const loadAggregatorPermissions = useCallback(async () => {
        if (id) {
            await permisssionService.fetchAggregatorRolePermission(id, aggregatorCode, pageSize, pageNumber, dispatch);
        }
    }, [id, permisssionService, aggregatorCode, pageSize, pageNumber, dispatch]);
   

    useEffect(() => {
        setPermissionLists(permissions);
    }, [permissions]);

    useEffect(() => {
        setFilteredData(aggregatorPermissions);
    }, [aggregatorPermissions]);
    useEffect(() => {
        setIsAggregatorPermissionsLoading(aggregatorPermissionsLoading);
    }, [aggregatorPermissionsLoading]);
                
    useEffect(() => {
        setIsPermissionsLoading(permissionsLoading);
    }, [permissionsLoading]);
        
    useEffect(() => {
        setErrMsg(aggregatorPermissionsError);
    }, [aggregatorPermissionsError]);

    useEffect(() => {
        loadPermissions();
    }, [loadPermissions]);

    useEffect(() => {
        loadAggregatorPermissions();
    }, [loadAggregatorPermissions]);
          
    // useEffect(() => {
    // setPageNumber(aggregatorPermissionsPageNumber);
    // }, [aggregatorPermissionsPageNumber]);
        
    // useEffect(() => {
    // setPageSize(aggregatorPermissionsPageSize);
    // }, [aggregatorPermissionsPageSize]);
        
    useEffect(() => {
    setTotalSize(aggregatorPermissionsTotalSize);
    }, [aggregatorPermissionsTotalSize]);

   

    return (
        <ManagePermissionTable
            filteredData={filteredData}
            isLoading={isAggregatorPermissionsLoading}
            errMsg={errMsg}
            handleRefresh={handleRefresh}
            permissionLists={permissionLists}
            handleOptionRefresh={handleOptionRefresh}
            totalSize={totalSize}
            currentPage={pageNumber}
            // setCurrentPage={setPageNumber}
            rowsPerPage={pageSize}
            // setRowsPerPage={setPageSize}
        />
    );
}

export default ManagePermission;