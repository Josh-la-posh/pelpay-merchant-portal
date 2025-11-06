import { useEffect, useState, useCallback, useMemo } from 'react';
import DataTable from '@/components/Table';
import useAuth from '@/services/hooks/useAuth';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import RoleService from '@/services/api/rolesApi';
import { useDispatch, useSelector } from 'react-redux';
import { Trash} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';
import { CheckCircle,  X } from 'lucide-react';
import PermissionService from "@/services/api/permissionApi";

const RoleAssignmentTable = ({
    filteredData,
    errMsg,
    // permissionLists,
    handleRefresh,
    isUserRoleLoading
}) => {
    const { id } = useParams();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const roleService = useMemo(() => new RoleService(axiosPrivate, auth), [axiosPrivate, auth]);
    const merchantCode = auth?.merchant?.merchantCode;
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const dispatch = useDispatch();
    const { roles } = useSelector((state) => state.roles || {});
    const [availableUserRoles, setAvailableUserRoles] = useState(() => roles || []);


    const roleId = filteredData?.[0]?.roleId;
    const permissionService = new PermissionService(axiosPrivate, auth);
    const [permissionLists, setPermissionLists] = useState([]);
    const pageNumber = 1;
    const pageSize = 40;

    const [formData, setFormData] = useState({
        roleId: 0,
        userId: id
    });
    
    const resetState = () => {
        setFormData({
            roleId: 0,
            userId: id
        });
    }

    const updateFormData = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        setAvailableUserRoles(roles);
    }, [roles])

    const availableRoles = useCallback(async () => {
        await roleService.fetchRoles(aggregatorCode,  dispatch);
    }, [roleService, aggregatorCode, dispatch]);

    useEffect(() => {
        availableRoles();
    }, [availableRoles]);

    const handleRoleRefresh = () => {
        availableRoles();
    }

    const addRole = async () => {
        await roleService.addUserRole(merchantCode, formData);
        resetState();
        handleRefresh();
    }

    const removeRole = async () => {
        try {
            await roleService.removeUserRole(id, merchantCode);
            resetState();
            handleRefresh();
        } catch (error) {
            console.error(error);
        }
    }
    const handleOptionRefresh = () => {
        loadPermissions();
    }

     useEffect(() => { 
    const loadPermissions = async () => {
        if (roleId) {
            try {
                const response = await permissionService.fetchAggregatorRolePermission(roleId, aggregatorCode, pageSize, pageNumber, dispatch);
                setPermissionLists(response.data || []);
            } catch (err) {
                console.error("Error fetching permissions:", err);
            }
        }else {
            setPermissionLists([]);
        }
    };

    loadPermissions();
    }, [roleId, aggregatorCode, dispatch]);


    // duplicate availableRoles removed; use memoized version above
 
    const columns = [
        {
            header: 'Name',
            accessor: 'roleName'
        },
        {
            header: 'Description',
            accessor: 'roleDescription'
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (id) => (
                <button
                    onClick={() => removeRole(id)}
                    className='text-red-700 px-2 py-1 rounded-[4px] border border-transparent hover:border-red-700'
                >
                    <Trash size='14px' />
                </button>
            ),
        },
    ];

    if (isUserRoleLoading) return (
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
                            value={formData.roleId}
                            onChange={(e) => updateFormData('roleId', (e.target.value))}
                        >
                            <option value="0" disabled>
                                Select Role
                            </option>
                            {
                                Array.isArray(availableUserRoles) && availableUserRoles.map((role) => (
                                    <option 
                                        key={role.id}
                                        value={role.id}
                                        className='text-xs'
                                        
                                    >
                                        {role.roleName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {
                        availableUserRoles.length === 0 &&
                        <div className="flex justify-end">
                            <button
                                onClick={handleRoleRefresh}
                                className='text-xs text-priColor'
                            >
                                Reload
                            </button>
                        </div>
                    }
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={addRole}
                        className='w-28 bg-priColor text-xs text-white py-2 px-5 rounded-sm'
                    >
                        Submit
                    </button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                drop=''
            />
            {filteredData?.length > 0 && roleId && (
 <div className="p-5">
                <div className="font-semibold text-gray-800 mb-3 mt-10 text-base">
                    User Role Permissions
                </div>

                <ul className="">
                    {permissionLists?.length > 0 ? (
                        permissionLists.map((perm) => (
                            <li
                                key={perm.id || perm.permission?.permissionName}
                                className="flex items-center justify-between px-4 py-3 border-b border-gray-500"
                            >
                                <span className="font-medium text-gray-700 capitalize">
                                {perm.permission?.permissionName || "—"}
                                </span>

                                <div className="flex items-center gap-1">
                                    <span className={`flex items-center gap-1 ${perm.canRead ? 'text-green-600' : 'text-red-600'}`}>
                                    {perm.canRead ? <CheckCircle size='14px' /> : <X size='14px' />}
                                    Read
                                    </span>

                                    <span className={`flex items-center gap-1 ${perm.canAdd ? 'text-green-600' : 'text-red-600'}`}>
                                    {perm.canAdd ? <CheckCircle size='14px' /> : <X size='14px' />}
                                    Add
                                    </span>

                                    <span className={`flex items-center gap-1 ${perm.canEdit ? 'text-green-600' : 'text-red-600'}`}>
                                    {perm.canEdit ? <CheckCircle size='14px' /> : <X size='14px' />}
                                    Edit
                                    </span>
                              
                                    <span className={`flex items-center gap-1 ${perm.canDelete ? 'text-green-600' : 'text-red-600'}`}>
                                    {perm.canDelete ? <CheckCircle size='14px' /> : <X size='14px' />}
                                    Delete
                                    </span>
                                
                                {!perm.canRead &&
                                    !perm.canAdd &&
                                    !perm.canEdit &&
                                    !perm.canDelete && (
                                    <span className="text-gray-400 ">No permission assigned</span>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                    <li className="px-4 py-3 text-gray-500">No permissions assigned.</li>
                    )} 
                </ul>
            </div>
            )}
          
        </div>
    );
};

export default RoleAssignmentTable;

// PropTypes
import PropTypes from 'prop-types';

RoleAssignmentTable.propTypes = {
    filteredData: PropTypes.array,
    errMsg: PropTypes.any,
    handleRefresh: PropTypes.func,
    isUserRoleLoading: PropTypes.bool,
};