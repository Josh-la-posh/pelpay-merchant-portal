import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import MerchantService from '@/services/api/merchantApi';
import UserService from '@/services/api/userApi';
import { Link } from 'react-router-dom';
import useAuth from '@/services/hooks/useAuth';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function MerchantProfile() {
    const { auth } = useAuth();
    const merchantCode = auth?.merchant?.merchantCode;
    const { setAppTitle } = useTitle();
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const merchantService = new MerchantService(axiosPrivate);
    const userService = new UserService(axiosPrivate);
    const dispatch = useDispatch();
    const { aggregatorUser, aggregatorUserLoading } = useSelector((state) => state.users);
    const [users, setUsers] = useState(aggregatorUser);
    const [canAddUser, setCanAddUser] = useState(false);
    const { merchantProfile, merchantProfileLoading, merchantProfileError } = useSelector((state) => state.merchant);
    const [isLoading, setIsLoading] = useState(merchantProfileLoading);
    const [errMsg, setErrMsg] = useState(merchantProfileError);
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        userId : '',
        merchantId : ''
    });
        
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            merchantId: auth?.merchant?.id
        }))
    }, [auth])
        
    useEffect(() => {
        setIsLoading(merchantProfileLoading);
    }, [merchantProfileLoading]);
        
    useEffect(() => {
        setErrMsg(merchantProfileError);
    }, [merchantProfileError]);
        
    useEffect(() => {
        setUsers(aggregatorUser);
        setFormData((prev) => ({
            ...prev,
            userId: aggregatorUser[0]?.id
        }))

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

    useEffect(() => {
        setAppTitle('Merchant');
        setSettingsTitle('Profile')
    }, []);

    useEffect(() => {
        loadData();
    }, [merchantCode, dispatch]);
    
    const handleSubmit = (e) => {
        const v1 = formData.userId;
        if (v1 === '') {
            toast('User Id cannot be empty');
            return;
        }
        addMerchant();
    }

    const handleRefresh = () => {
        loadData();
    }
    
    const loadData = async () => {
        if (merchantCode) {
            await merchantService.fetchMerchantProfile(merchantCode, dispatch);
        }
    };
    
    const addMerchant = async () => {
        await merchantService.addUserMerchant(formData);
    };
    
    const fetchUsers = async () => {
        const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
        await userService.fetchUserByAggregatorCode(aggregatorCode, 1, 20, dispatch);
    };

    if (isLoading) return (
        <div className='h-[40vh] w-full'>
            <Spinner />
        </div>
    );

    if (errMsg !== null) return (
        <div className='h-[40vh] w-full'>
            <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />
        </div>
    );

    return (
        <div className="bg-white p-5">
            <div className="mb-8 flex justify-between items-center">
                <p className='text-md'>Merchant ({merchantProfile.merchantName})</p>
                {
                    isExpanded && <div className="flex items-center gap-4">
                        <div className="flex justify-end">
                            { canAddUser &&
                                <div className ="flex items-center justify-center gap-2">
                                    <select id='users' value={users.id} onChange={handleUserChange} className='flex-grow text-xs px-4 py-2 border border-gray-300 rounded-md outline-gray-400' defaultValue='Select User'>
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
                                        className='text-white border border-gray-300 bg-priColor text-xs font-[600]  py-2 px-5 rounded-md flex justify-between items-center'
                                        onClick={handleSubmit}
                                        >
                                            Add
                                    </button>
                                </div>
                            }
                            {
                                canAddUser === false &&
                                <button
                                    onClick={() => setCanAddUser(true)}
                                    className={`text-white border border-gray-300 bg-priColor text-xs font-[600] py-2 px-5 rounded-md flex justify-between items-center gap-2`}
                                    >
                                        <Plus size='14' />
                                        Add User
                                </button>
                            }
                        </div>
                        <Link to={`/merchants/profile/update/${merchantCode}`} className='bg-priColor text-xs text-white py-2 px-5 rounded-md text-center'>
                            Update profile
                        </Link>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className={`w-4 h-4 text-white flex justify-center items-center bg-priColor text-xs font-[600] rounded-full shadow-xl`}
                            >
                                <X size='12px' />
                        </button>
                    </div>
                }
                {!isExpanded &&
                    <button
                        onClick={() => setIsExpanded(true)}
                        className={`w-9 h-9 text-white flex justify-center items-center bg-priColor text-xs font-[600] rounded-full shadow-xl`}
                        >
                            <Plus size='22px' />
                    </button>
                }
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-[700] text-gray-600">
                <div className="flex">
                    <p className='flex-1'>Merchant Code:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.merchantCode}</span>

                </div>
                <div className="flex">
                    <p className='flex-1'>Address:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.address ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>City:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.city ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>State:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.state ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>Phone Number:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.phoneNumber ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>Postal Code:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.postalCode ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>Country:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.countryCode ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>Status:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.status ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>White Listed:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.isWhitelisted === true ? 'True' : 'False'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>Business type:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.businessType ?? 'N/A'}</span>
                </div>
                <div className="flex">
                    <p className='flex-1'>Registration Type:</p>
                    <span className='font-[400] ml-4 flex-1'>{merchantProfile.registrationType ?? 'N/A'}</span>
                </div>
            </div>
        </div>
    )
}

export default MerchantProfile;