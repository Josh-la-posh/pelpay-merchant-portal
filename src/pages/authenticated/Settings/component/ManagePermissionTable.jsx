import { useState } from 'react';
import DataTable from '@/components/Table';
import useAuth from '@/services/hooks/useAuth';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import PermissionService from '@/services/api/permissionApi';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Edit3, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

const ManagePermissionTable = ({
    filteredData,
    isLoading,
    errMsg,
    handleRefresh,
    permissionLists = [],
    handleOptionRefresh,
    totalSize,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage
}) => {
    const { id } = useParams();
    console.log('Role ID in ManagePermissionTable:', id);
    // const newId = Number(id);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const permissionService = new PermissionService(axiosPrivate, auth);
    const [roleMode, setRoleMode] = useState('create');
    const [selectedID, setSelectedID] = useState('');
    const merchantCode = auth?.merchant?.merchantCode;
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;

    const dispatch = useDispatch();
    const { updatePermissionsLoading } = useSelector((state) => state.permissions);

    const [formData, setFormData] = useState({
        roleId: id,
        permissionId: 0,
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canRead: false
    });

    const updateFormData = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleEdit = (row) => {
        setSelectedID(row.id);
        setRoleMode('edit');
        setFormData({
            roleId: row.roleId,
            permissionId: row.permissionId,
            canAdd: row.canAdd,
            canEdit: row.canEdit,
            canDelete: row.canDelete,
            canRead: row.canRead
        });
    }

    const cancelEditing = () => {
        setRoleMode('create');
        setFormData({
            roleId: id,
            permissionId: 0,
            canAdd: false,
            canEdit: false,
            canDelete: false,
            canRead: false
        });
    }

    const handleAction = (row) => {
        const roleId = row.id;
        row.isActive === false 
            ? activatePermission(roleId) 
            : deactivatePermission(roleId);
    }

    const activatePermission = async (roleId) => {
        try {
            await permissionService.activateAggregatorRolePermission(
                roleId,
                aggregatorCode
            );                
            cancelEditing();
            handleRefresh();
        } catch (error) {
            console.error(error);
        }
    }

    const deactivatePermission = async (roleId) => {
        try {
            await permissionService.deactivateAggregatorRolePermission(
                roleId,
                aggregatorCode
            );            
            cancelEditing();
            handleRefresh();
        } catch (error) {
            console.error(error);
        }
    }

    const updatePermission = async (roleId) => {
        try {
            await permissionService.updateAggregatorRolePermission(
                roleId,
                aggregatorCode,
                formData,
                dispatch
            );
            cancelEditing();
            handleRefresh();
        } catch (error) {
            console.error(error);
        }
    }

    const createPermission = async () => {
        try {
            console.log('formData', formData);  
            await permissionService.createRolePermission(               
                merchantCode,
                formData,
                dispatch
            );
            cancelEditing();
            handleRefresh();
        } catch (error) {
            console.error(error);
        }
    }

    const handlePermission = () => {
        roleMode === 'create'
            ? createPermission()
            : updatePermission(Number(selectedID));
    }
 
    const columns = [
        {
            header: 'Permissions',
            accessor: 'permission',
            render: (permission) => (
                <span>
                    {permission?.permissionName}
                </span>
            )
        },
        {
            header: 'Can Read',
            accessor: 'canRead',
            render: (value) => (
                <span className={`${value === true ? 'text-green-600' : 'text-red-600'}`}>
                    {value === true ? <CheckCircle size='14px' /> : <X size='14px' />}
                </span>
            )
        },
        {
            header: 'Can Add',
            accessor: 'canAdd',
            render: (value) => (
                <span className={`${value === true ? 'text-green-600' : 'text-red-600'}`}>
                    {value === true ? <CheckCircle size='14px' /> : <X size='14px' />}
                </span>
            )
        },
        {
            header: 'Can Edit',
            accessor: 'canEdit',
            render: (value) => (
                <span className={`${value === true ? 'text-green-600' : 'text-red-600'}`}>
                    {value === true ? <CheckCircle size='14px' /> : <X size='14px' />}
                </span>
            )
        },
        {
            header: 'Can Delete',
            accessor: 'canDelete',
            render: (value) => (
                <span className={`${value === true ? 'text-green-600' : 'text-red-600'}`}>
                    {value === true ? <CheckCircle size='14px' /> : <X size='14px' />}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'isActive',
            render: (isActive, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className='text-priColor px-2 py-1 rounded-[4px] border border-transparent hover:border-priColor'
                    >
                        <Edit3 size='14px' />
                    </button>
                    <button
                        onClick={() => handleAction(row)}
                        className={`${isActive === true ? 'text-green-700' : 'text-red-700'}`}
                    >
                        {isActive === true ? <ToggleRight size='32' /> : <ToggleLeft size='32px' />}
                    </button>                    
                </div>
            ),
        },
    ];

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
        <div className="">
            <div className='bg-white w-full space-y-6 px-12 pt-12 pb-24'>
                <div className="w-full">
                    <div className="w-full border border-gray-300 focus:outline-gray-300 p-2 rounded-md">
                        <select
                            className='w-full text-sm border border-none focus:outline-none p-1 rounded-md'
                            value={formData.permissionId}
                            onChange={(e) => updateFormData('permissionId', Number(e.target.value))}
                        >
                            <option value="0" disabled>
                                Select Permission
                            </option>
                            {
                                Array.isArray(permissionLists) && permissionLists.map((list) => (
                                    <option 
                                        key={list.id}
                                        value={list.id}
                                        className='text-xs'
                                        
                                    >
                                        {list?.permissionName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {
                        permissionLists.length === 0 &&
                        <div className="flex justify-end">
                            <button
                                onClick={handleOptionRefresh}
                                className='text-xs text-priColor'
                            >
                                Reload
                            </button>
                        </div>
                    }
                </div>
                <div className="md:flex items-center gap-8 flex-wrap">
                    {['canRead', 'canAdd', 'canEdit', 'canDelete'].map((perm) => (
                        <label key={perm} className='flex gap-2 items-center'>
                            <input
                                type="checkbox"
                                checked={formData[perm]}
                                onChange={(e) => updateFormData(perm, e.target.checked)}
                            />
                            {perm.replace('can', 'Can ')}
                        </label>
                    ))}
                </div>
                {
                    roleMode === 'create'
                        ?   (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handlePermission}
                                    className='w-28 bg-priColor text-xs text-white py-2 px-5 rounded-sm'
                                >
                                    {updatePermissionsLoading ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        )
                        : (
                            <div className="md:flex gap-3">
                                <button 
                                    onClick={handlePermission}
                                    className='w-28 flex items-center justify-center gap-2 bg-priColor text-xs text-white py-2 px-5 rounded-sm'
                                >
                                    {updatePermissionsLoading ? 'Updating ...' : 'Update'}
                                </button>
                                <button 
                                    onClick={cancelEditing} 
                                    className='flex items-center justify-center border border-priColor text-xs text-priColor py-2 px-6 rounded-sm'
                                >
                                    Cancel
                                </button>
                            </div>
                        )
                }
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                totalSize={totalSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
            />
        </div>
    );
};

export default ManagePermissionTable;

// PropTypes
import PropTypes from 'prop-types';

ManagePermissionTable.propTypes = {
    filteredData: PropTypes.array,
    isLoading: PropTypes.bool,
    errMsg: PropTypes.any,
    handleRefresh: PropTypes.func,
    permissionLists: PropTypes.array,
    handleOptionRefresh: PropTypes.func,
    totalSize: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    rowsPerPage: PropTypes.number,
    setRowsPerPage: PropTypes.func,
};