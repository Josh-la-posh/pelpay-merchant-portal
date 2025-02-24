import React, { useState } from 'react';
import DataTable from '@/components/Table';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import UserService from '@/services/api/userApi';
import { useDispatch } from 'react-redux';
import { CheckCircle, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserManagementTable = ({filteredData, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage}) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const merchantCode = auth?.merchant?.merchantCode;
    const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
    const userService = new UserService(axiosPrivate, auth);
    
    const columns = [
        {
            header: 'LASTNAME',
            accessor: 'lastName',
        },
        {
            header: 'FIRSTNAME',
            accessor: 'firstName',
        },
        {
            header: 'EMAIL',
            accessor: 'email',
        },
        {
            header: 'PHONE NUMBER',
            accessor: 'phoneNumber',
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
            header: 'ASSIGN ROLE',
            accessor: 'id',
            render: (id, row) => (
                <div className="flex items-center">
                    {
                    row.isAdmin === true
                        ?
                            <p className='text-xs'>Super Admin</p>
                        :
                            <Link
                                to={`${id}/roleAssign`}
                                className='text-priColor text-xs px-2 py-1 rounded-[4px] border border-transparent hover:border-priColor'
                            >
                                User Role
                            </Link>
                    }
                </div>
            ),
        },
        {
            header: 'Action',
            accessor: 'isActive',
            render: (isActive, row) => (
                <div>
                    {row.isAdmin === false && 
                    <button
                        onClick={() => handleAction(row)}
                        className={`${isActive === true ? 'text-green-700' : 'text-red-700'} text-xs`}
                    >
                        {isActive === true ? <ToggleRight size='32px' /> : <ToggleLeft size='32px' />}
                    </button>}
                </div>
            ),
        },
    ];

    const activateAccount = async (id) => {
        await userService.activateUser(
            id,
            merchantCode,
            aggregatorCode,
            dispatch
          );
    }

    const deactivateAccount = async (id) => {
        await userService.deactivateUser(
            id,
            merchantCode,
            aggregatorCode,
            dispatch
        );
    }

    const handleAction = (row) => {
        const id = row.id;
        row.isActive === false 
            ? activateAccount(id, merchantCode, dispatch) 
            : deactivateAccount(id, merchantCode, dispatch);
    }
    
    const handleSelectedRow = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <div className="">
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

export default UserManagementTable;