import { useState, useEffect } from 'react';
import DataTable from '@/components/Table';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import RoleService from '@/services/api/rolesApi';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Edit3, Plus, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const RoleManagementTable = ({filteredData}) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const { updateRolesLoading, updateRolesError } = useSelector((state) => state.roles);
    const [isUpdate, setIsUpdate] = useState(updateRolesLoading);
    const [updateErrMsg, setUpdateErrMsg] = useState(updateRolesError);
    const merchantCode = auth?.merchant?.merchantCode;
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const [isEditing, setIsEditing] = useState(false);
    const [roleMode, setRoleMode] = useState('create');
    const roleService = new RoleService(axiosPrivate, auth);
    const [selectedID, setSelectedID] = useState('');
    const [formData, setFormData] = useState({
        roleName: '',
        roleDescription: ''
    });
    
    const columns = [
        {
            header: 'Name',
            accessor: 'roleName',
        },
        {
            header: 'Description',
            accessor: 'roleDescription',
        },
        {
            header: 'STATUS',
            accessor: 'isActive',
            render: (value) => (
                <span className={`${value === true ? 'text-green-600' : 'text-red-600'}`}>
                    {value === true ? <CheckCircle size='14px' /> : <X size='14px' />}
                </span>
            )
        },
        {
            header: 'Permissions',
            accessor: 'id',
            render: (id) => (
                <div className="flex items-center">
                    <Link
                        to={`${id}/managePermission`}
                        className='text-priColor text-xs px-2 py-1 rounded-[4px] border border-transparent hover:border-priColor'
                    >
                        Manage
                    </Link>
                </div>
            ),
        },
        {
            header: 'Edit',
            accessor: 'id',
            render: (id, row) => (
                <div className="flex">
                    <button
                        onClick={() => handleEdit(row)}
                        className='text-priColor text-xs px-2 py-1 rounded-[4px] border border-transparent hover:border-priColor'
                    >
                        <Edit3 size='14px' />
                    </button>
                </div>
            ),
        },
        {
            header: 'Action',
            accessor: 'isActive',
            render: (isActive, row) => (
                <button
                    onClick={() => handleAction(row)}
                    className={`${isActive === true ? 'text-green-700' : 'text-red-700'}`}
                >
                    {isActive === true ? <ToggleRight size='32' /> : <ToggleLeft size='32px' />}
                </button>
            ),
        },
    ];

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        setIsUpdate(updateRolesLoading);
    }, [updateRolesLoading]);

    useEffect(() => {
        setUpdateErrMsg(updateErrMsg);
        if (updateErrMsg) {
            const t = setTimeout(() => setUpdateErrMsg(''), 2000);
            return () => clearTimeout(t);
        }
    }, [updateErrMsg]);

    const handleEdit = (row) => {
        setSelectedID(row.id);
        setRoleMode('eidt');
        setIsEditing(true);
        setFormData({
            roleName: row.roleName,
            roleDescription: row.roleDescription
        });
    }

    const cancelEditing = () => {
        setRoleMode('create');
        setFormData({
            roleName: '',
            roleDescription: ''
        });
    }

    const activateRole = async (id) => {
        await roleService.activateRole(
            id,
            aggregatorCode,
            merchantCode,
            dispatch);
    }

    const deactivateRole = async (id) => {
        await roleService.deactivateRole(
            id,
            aggregatorCode,
            merchantCode,
            dispatch
        );
    }

    const updateRole = async (id) => {
        await roleService.updateRolesById(
            id,
            merchantCode,
            aggregatorCode,
            formData,
            dispatch
        );
    }

    const handleAddNewRole = () => {
        setIsEditing(true);
        setRoleMode('create');
        setFormData({
            roleName: '',
            roleDescription: ''
        });
    }

    const createRole = async () => {
        await roleService.updateRolesById(
            aggregatorCode,
            formData,
            merchantCode,
            dispatch
        );
    }

    const handleRole = () => {
        const v1 = formData.roleName;
        const v2 = formData.roleDescription;

        if (v1 === '' && v2 === '') return toast('Fields can\'t be empty');
        if (v1 === '' && v2 !== '') return toast('Name can\'t be empty');
        if (v1 !== '' && v2 === '') return toast('Description can\'t be empty');

        roleMode === 'create'
            ? createRole()
            : updateRole(selectedID);
        
        updateRolesError === '' && setFormData({
            roleName: '',
            roleDescription: ''
        });
    }

    const handleAction = (row) => {
        const id = row.id;
        row.isActive === false 
            ? activateRole(id, aggregatorCode, merchantCode, dispatch) 
            : deactivateRole(id, aggregatorCode, merchantCode, dispatch);
    }

    return (
        <div className="">
            <div className="bg-white px-3 py-5 ">
                <div className="flex justify-end mb-5">
                    {
                        isEditing                    
                            ?   <div className="md:flex items-center gap-3">                        
                                    <input
                                        type="text"
                                        id="roleName"
                                        name="roleName"
                                        placeholder="Name"
                                        value={formData.roleName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none"
                                    />
                                    <input
                                    type="text"
                                    id="roleDescription"
                                    name="roleDescription"
                                    placeholder="Description"
                                    value={formData.roleDescription}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none"
                                    />
                                    {
                                        roleMode === 'create'
                                            ?   (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={handleRole}
                                                        className='w-24 bg-priColor text-xs text-white py-2 px-5 rounded-sm'
                                                    >
                                                        {isUpdate ? 'Adding Role...' : 'Add Role'}
                                                    </button>
                                                    <button 
                                                        onClick={() => setIsEditing(false)} 
                                                        className='flex items-center justify-center bg-priColor text-xs text-white p-1 rounded-full'
                                                    >
                                                        <X size='12px' />
                                                    </button>
                                                </div>
                                            )
                                            : (
                                                <div className="md:flex gap-3">
                                                    <button 
                                                        onClick={handleRole}
                                                        className='w-24 flex items-center justify-center gap-2 bg-priColor text-xs text-white py-2 px-5 rounded-sm'
                                                    >
                                                        {isUpdate ? 'Updating Role ...' : 'Update'}
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
                            :   <button
                                    onClick={handleAddNewRole}
                                    className='w-8 h-8 flex items-center justify-center bg-priColor text-xs text-white rounded-full shadow-lg'>
                                    <Plus size='14px' />
                                </button>
                    }
                </div>
                {updateErrMsg && <div className="flex justify-center my-4 text-red-600">{updateErrMsg}</div>}
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                drpp= ''
            />
        </div>
    );
};

export default RoleManagementTable;

import PropTypes from 'prop-types';

RoleManagementTable.propTypes = {
    filteredData: PropTypes.array,
};