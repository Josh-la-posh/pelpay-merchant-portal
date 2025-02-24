import React, { useEffect, useState } from 'react'
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import PermissionService from '@/services/api/permissionApi';
import { useDispatch, useSelector } from 'react-redux';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import ManagePermissionTable from './component/ManagePermissionTable';
import { useParams } from 'react-router-dom';

function ManagePermission() {
    const { id } = useParams();
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const { permissions, aggregatorPermissionsPageSize, aggregatorPermissionsPageNumber, aggregatorPermissionsTotalSize, aggregatorPermissions, permissionsLoading, aggregatorPermissionsLoading, permissionsError, aggregatorPermissionsError } = useSelector((state) => state.permissions);
    const [permissionLists, setPermissionLists] = useState(permissions);
    const [filteredData, setFilteredData] = useState(aggregatorPermissions);
    const [isAggregatorPermissionsLoading, setIsAggregatorPermissionsLoading] = useState(aggregatorPermissionsLoading);
    const [isPermissionsLoading, setIsPermissionsLoading] = useState(permissionsLoading);
    const [errMsg, setErrMsg] = useState(permissionsError);
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const permisssionService = new PermissionService(axiosPrivate, auth);
    const [pageNumber, setPageNumber] = useState(aggregatorPermissionsPageNumber);
    const [pageSize, setPageSize] = useState(aggregatorPermissionsPageSize);
    const [totalSize, setTotalSize] = useState(aggregatorPermissionsTotalSize);

    useEffect(() => {
        setSettingsTitle('Roles');
    }, []);

    useEffect(() => {
        setFilteredData(aggregatorPermissions);
    }, [aggregatorPermissions]);

    useEffect(() => {
        setPermissionLists(permissions);
    }, [permissions]);
                
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
    }, []);

    useEffect(() => {
        loadAggregatorPermissions();
    }, []);
          
    useEffect(() => {
    setPageNumber(aggregatorPermissionsPageNumber);
    }, [aggregatorPermissionsPageNumber]);
        
    useEffect(() => {
    setPageSize(aggregatorPermissionsPageSize);
    }, [aggregatorPermissionsPageSize]);
        
    useEffect(() => {
    setTotalSize(aggregatorPermissionsTotalSize);
    }, [aggregatorPermissionsTotalSize]);

    const handleRefresh = () => {
        loadAggregatorPermissions();
    }
    
    const handleOptionRefresh = () => {
        loadPermissions();
    }
    
    const loadPermissions = async () => {
        if (id) {
            await permisssionService.fetchRolePermission(id, aggregatorCode, dispatch);
        }
    };
    
    const loadAggregatorPermissions = async () => {
        if (id) {
            await permisssionService.fetchAggregatorRolePermission(id, aggregatorCode, pageSize, pageNumber, dispatch);
        }
    };

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
            setCurrentPage={setPageNumber}
            rowsPerPage={pageSize}
            setRowsPerPage={setPageSize}
        />
    );
}

export default ManagePermission;