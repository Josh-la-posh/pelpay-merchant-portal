import React, { useEffect, useState } from 'react';
import DataTable from '@/components/Table';
import { dateFormatter } from '@/utils/dateFormatter';
import { Link } from 'react-router-dom';
import { Pen } from 'lucide-react';
import CustomModal from '@/components/Modal';
import MerchantService from '@/services/api/merchantApi';
import UserService from '@/services/api/userApi';
import { toast } from 'react-toastify';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@/services/hooks/useAuth';

const MerchantTable = ({filteredData, handleOpenModal}) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const merchantService = new MerchantService(axiosPrivate);
    const userService = new UserService(axiosPrivate);
    const dispatch = useDispatch();
    const { aggregatorUser } = useSelector((state) => state.users);
    const [users, setUsers] = useState(aggregatorUser);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        userId : '',
        merchantId : ''
    });
    
    const columns = [
        {
            header: 'Date',
            accessor: 'createdDate',
            render: (value) => (
                <span>
                    {dateFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Merchant',
            accessor: 'merchantName',
        },
        {
            header: 'Profile',
            accessor: 'merchantCode',
            render: (row) => (
                <Link
                    to={`/merchants/profile/${row}`}
                    className='text-priColor'
                >
                    Profile
                </Link>
            )
        },
        // {
        //     header: 'Domain',
        //     accessor: 'merchantCode',
        //     render: (id) => (
        //         <Link
        //             to={`/merchants/domain/${id}`}
        //             className='text-priColor'
        //         >
        //             Domain
        //         </Link>
        //     )
        // },
        {
            header: 'Document',
            accessor: 'merchantCode',
            render: (id) => (
                <Link
                    to={`/merchants/document/${id}`}
                    className='text-priColor'
                >
                    Document
                </Link>
            )
        },
        {
            header: 'Credentials',
            accessor: 'merchantCode',
            render: (id) => (
                <Link
                    to={`/merchants/credential/${id}`}
                    className='text-priColor'
                >
                    Credentials
                </Link>
            )
        },
        {
            header: 'Business Type',
            accessor: 'businessType',
        },
        {
            header: 'Charge Type',
            accessor: 'chargeType',
        },
        {
            header: 'Status',
            accessor: 'status',
        },
        {
            header: 'Action',
            accessor: 'id',
            render: (id) => (
                <button
                    onClick={() => handleModalOpen(id)}
                    className='p-2 rounded-sm border border-gray-200'
                >
                    <Pen size='14px' />
                </button>
            ),
        },
    ];

    useEffect(() => {
        setUsers(aggregatorUser);
    }, [aggregatorUser])

    useEffect(() => {
        fetchUsers();
    }, [])

    const handleUserChange = (e) => {
        const {value} = e.target;

        setFormData((prev) => ({
            ...prev,
            userId: value
        }))
    }

    const handleModalOpen = (id) => {
        setIsModalOpen(true);
        setFormData((prev) => ({
            ...prev,
            merchantId: id
        }));
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({
            userId: '',
            merchantId: ''
        });
    }

    const getDataToParent = (id) => {
        handleOpenModal(filteredData[id]);
    }

    const handleSubmit = (e) => {
        const v1 = formData.userId;

        if (v1 === '') {
            toast('User Id cannot be empty');
            return;
        }
        loadData();
    }
    
    const handleSelectedRow = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };
    
    const loadData = async () => {
        await merchantService.addUserMerchant(formData);
    };
    
    const fetchUsers = async () => {
        const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
        await userService.fetchUserByAggregatorCode(aggregatorCode, 1, 20, dispatch);
    };

    return (
        <div className="">
            {
                isModalOpen &&
                <CustomModal
                    handleOpenModal={handleModalClose}
                >
                    <h2 className='mb-8'>New User</h2>

                    <div className="flex mt-8 gap-3">
                        <select id='users' value={users.id} onChange={handleUserChange} className='flex-grow px-4 py-2 outline-gray-400' defaultValue='Select User'>
                            {
                                users &&
                                users.map((user) =>
                                 (<option key={user.id} value={user.id} className='text-xs max-w-fit'>
                                    {user.firstName} {user.lastName}
                                </option>)
                                )
                            }
                        </select>
                        <button
                            className='text-white border border-gray-300 bg-priColor text-xs font-[600] py-2 px-5 rounded-md flex justify-between items-center'
                            onClick={handleSubmit}
                            >
                                Add
                        </button>
                    </div>

                </CustomModal>
            }

            <DataTable
                columns={columns}
                data={filteredData}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onIndexChange={handleSelectedRow}
                selectedIndex={selectedIndex}
                displayActionButton={false}
                elementId='MerchantTable'
            />
        </div>
    );
};

export default MerchantTable;