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
import MerchantProfileContent from './components/merchantProfile/MerchantProfileContent';

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

    const restoreDefault = () => {
        setIsExpanded(false);
        setCanAddUser(false);
    }

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
            <div className="space-y-5 sm:space-y-0 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center justify-between space-x-5">
                    <p className='text-md'>Merchant ({merchantProfile.merchantName})</p>
                    {!isExpanded &&
                        <button
                            onClick={() => setIsExpanded(true)}
                            className={`w-9 h-9 text-white flex justify-center items-center bg-priColor text-xs font-[600] rounded-full shadow-xl`}
                            >
                                <Plus size='22px' />
                        </button>
                    }
                </div>
                {
                    isExpanded && <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex justify-end">
                            { canAddUser &&
                                <div className ="flex flex-row items-center justify-center gap-2">
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
                            <span className='sm:hidden'>Update</span><span className='hidden sm:block'>Update profile</span>
                        </Link>
                        <button
                            onClick={restoreDefault}
                            className={`w-4 h-4 text-white flex justify-center items-center bg-priColor text-xs font-[600] rounded-full shadow-xl`}
                            >
                                <X size='12px' />
                        </button>
                    </div>
                }                
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-[700] text-gray-600">
                <MerchantProfileContent
                    title='Merchant Code'
                    value={merchantProfile.merchantCode}
                />
                <MerchantProfileContent
                    title='Address'
                    value={merchantProfile.address ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='City'
                    value={merchantProfile.city ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='State'
                    value={merchantProfile.state ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='Phone Number'
                    value={merchantProfile.phoneNumber ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='Postal Code'
                    value={merchantProfile.postalCode ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='Country'
                    value={merchantProfile.countryCode ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='Status'
                    value={merchantProfile.status ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='White Listed'
                    value={merchantProfile.isWhitelisted ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='Business Type'
                    value={merchantProfile.businessType ?? 'N/A'}
                />
                <MerchantProfileContent
                    title='Registration Type'
                    value={merchantProfile.registrationType ?? 'N/A'}
                />
            </div>
        </div>
    )
}

export default MerchantProfile;