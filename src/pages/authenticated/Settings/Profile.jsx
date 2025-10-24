import { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import UpdateInputField from '@/components/UpdateInputField';
import { Mail, Phone, User } from 'lucide-react';
import UserService from '@/services/api/userApi';
import { useDispatch, useSelector } from 'react-redux';

function ProfilePage() {
    const { auth, setAuth } = useAuth();
    const { setAppTitle } = useTitle();
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const userService = new UserService(axiosPrivate, auth, setAuth);
    const dispatch = useDispatch();
    const {newUserLoading, newUser} = useSelector((state) => state.users);
    const [editing, setEditing] = useState(false);
    const userDetails = auth?.data?.user;
    console.log('User Details in ProfilePage:', userDetails);
    const [isLoading, setIsLoading] = useState(newUserLoading);
    const [errMsg, setErrMsg] = useState('');
  
    const [formData, setFormData] = useState({
        firstName: userDetails?.firstName ?? '',
        lastName: userDetails?.lastName ?? '',
        email: userDetails?.email ?? '',
        phoneNumber: userDetails?.phoneNumber ?? ''
    });
              
    useEffect(() => {
        setIsLoading(newUserLoading);
    }, [newUserLoading]);

    useEffect(() => {
        if (newUser) {
            setAuth(prev => ({ ...prev, data: {
                ...prev.data,
                user: newUser
            } }));
        }
    }, [newUser]);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (auth?.data?.user !== null) {
            setFormData({
                firstName: userDetails.firstName ?? '',
                lastName: userDetails.lastName ?? '',
                email: userDetails.email ?? '',
                phoneNumber: userDetails.phoneNumber ?? ''
            });
        }
    }, [setAuth])

    const updateUserData = async () => {
        const userId = userDetails.id;
        await userService.updateUserData(userId, formData, dispatch);
    };

    const fetchUser = async () => {
        const merchantCode = auth?.merchant?.merchantCode;
        await userService.fetchUserProfile(merchantCode, dispatch);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const v1 = formData.firstName;
        const v2 = formData.lastName;
        const v3 = formData.email;
        const v4 = formData.phoneNumber;
        
    if (v1 !== '' && v2 !== '' && v3 !== '' && v4 !== '') {
            updateUserData();
            isLoading ? setEditing(true) : setEditing(false);
        } else {
            setErrMsg('All fields must be field');
            setTimeout(() => {
                setErrMsg('');
            }, 2000);
        }
    }

    useEffect(() => {
        setAppTitle('Settings');
        setSettingsTitle('Accounts');
    }, []);

  return (
    <div className="px-5 py-4 bg-white h-full">
        {/* <h3 className='text-gray-700 text-md font-[600]'>Profile</h3>
        <p className='text-gray-500 text-sm font-[500]'>This information will be displayed publicly so be careful what you share.</p> */}

        <div className="flex items-center space-x-16">
            <div className='h-20 w-20 rounded-full bg-gray-500 text-white font-[800] text-xl flex justify-center items-center'>{formData.firstName[0]} {formData.lastName[0]}</div>
            {/* <div className="flex space-x-3">
                <button type='submit' className='bg-priColor p-2 rounded-sm text-white text-[9px] font-[500]'>
                    Upload New
                </button>
                <button type='submit' className='bg-gray-300 p-2 rounded-sm text-black text-[9px] font-[500]'>
                    Delete avatar
                </button>
            </div> */}
        </div>

        <form onSubmit={handleSubmit} className='mt-8'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:grid-4">
                <UpdateInputField
                    label="First Name"
                    type='firstName'
                    icon={<User size={18}/>}
                    valueName={formData.firstName}
                    id="firstName"
                    disabled={!editing}
                    onChange={handleChange}
                />
                <UpdateInputField
                    label="Last Name"
                    type='lastName'
                    icon={<User size={18} />}
                    valueName={formData.lastName}
                    id="lastName"
                    onChange={handleChange}
                    disabled={!editing}
                />
                <UpdateInputField
                    label="Email"
                    type='email'
                    icon={<Mail size={18}/>}
                    valueName={formData.email}
                    id="email"
                    onChange={handleChange}
                    disabled={!editing}
                />
                <UpdateInputField
                    label="Mobile Number"
                    type='phone'
                    icon={<Phone size={18}/>}
                    valueName={formData.phoneNumber}
                    id="phoneNumber"
                    onChange={handleChange}
                    disabled={!editing}
                />
                
            </div>

            <p className='text-red-800 text-sm mb-5'>{errMsg}</p>
            {editing ? (
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="py-3 px-8 bg-gray-300 text-xs font-[500] rounded-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        type='submit' 
                        className='bg-priColor px-8 py-3 rounded-sm text-white text-xs font-[500]'>
                        {isLoading ? 'Updating ...' : 'Save Changes'}
                    </button>
                
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="bg-priColor px-8 py-3 rounded-sm text-white text-xs font-[500]"
                >
                    Edit Profile
                </button>
            )}

        </form>
    </div>
  )
}

export default ProfilePage;