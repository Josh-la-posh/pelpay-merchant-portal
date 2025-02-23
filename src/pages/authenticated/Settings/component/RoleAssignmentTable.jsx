import React, { useEffect, useState } from 'react';
import DataTable from '@/components/Table';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import RoleService from '@/services/api/rolesApi';
import { useDispatch, useSelector } from 'react-redux';
import { Trash} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

const RoleAssignmentTable = ({
    filteredData,
    errMsg,
    handleRefresh,
    isUserRoleLoading
}) => {
    const { id } = useParams();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const roleService = new RoleService(axiosPrivate, auth);
    const merchantCode = auth?.merchant?.merchantCode;
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const dispatch = useDispatch();
    const { roles, rolesLoading, rolesError } = useSelector((state) => state.roles);
    const [availableUserRoles, setAvailableUserRoles] = useState(roles);

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
        console.log(formData)
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        setAvailableUserRoles(roles);
    }, [roles])

    useEffect(() => {
        availableRoles();
    }, []);

    const handleRoleRefresh = () => {
        availableRoles();
    }

    const addRole = async () => {
        try {
            await roleService.addUserRole(merchantCode, formData);
            resetState();
            handleRefresh();
        } catch (error) {

        }
    }

    const removeRole = async (roleId) => {
        try {
            await roleService.removeUserRole(roleId, merchantCode);
            resetState();
            handleRefresh();
        } catch (error) {

        }
    }

    const availableRoles = async () => {
        await roleService.fetchRoles(aggregatorCode, merchantCode, dispatch);
    }
 
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
                            onChange={(e) => updateFormData('roleId', Number(e.target.value))}
                        >
                            <option value="0" disabled>
                                Select Role
                            </option>
                            {
                                availableUserRoles.map((role) => (
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
                rowsPerPageOptions={[10, 20, 40]}
            />
        </div>
    );
};

export default RoleAssignmentTable;