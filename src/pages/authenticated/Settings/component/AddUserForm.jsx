import { useState } from 'react'
import PropTypes from 'prop-types'
import CustomModal from '@/components/Modal'
import useAuth from '@/services/hooks/useAuth';
import UserService from '@/services/api/userApi';
import { useDispatch } from 'react-redux';
import { Mail, Phone, User } from 'lucide-react';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import UpdateInputField from '@/components/UpdateInputField';

function AddUserForm({ handleModalClose }) {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const userService = new UserService(axiosPrivate, auth);
    const dispatch = useDispatch();
    const [errMsg, setErrMsg] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const addNewUser = async () => {
        const merchantCode = auth?.merchant?.merchantCode;
        await userService.createUser(merchantCode, formData, dispatch);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { firstName, lastName, email, phoneNumber } = formData;

        if (firstName && lastName && email && phoneNumber) {
            addNewUser();
            handleModalClose && handleModalClose();
        } else {
            setErrMsg('All fields are required');
            setTimeout(() => {
                setErrMsg('');
            }, 2000);
        }
    };

  return (
    <CustomModal handleOpenModal={handleModalClose}>
        <div>New User</div>
        
        <form onSubmit={handleSubmit} className='mt-8'>
            <div className="flex gap-1 md:gap-4 lg:gap-8">
                <div className="w-full">
                    <UpdateInputField
                        label="First Name"
                        type='firstName'
                        icon={<User size={18}/>}
                        valueName={formData.firstName}
                        id="firstName"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full">
                    <UpdateInputField
                        label="Last Name"
                        type='lastName'
                        icon={<User size={18} />}
                        valueName={formData.lastName}
                        id="lastName"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex gap-1 md:gap-4 lg:gap-8">
                <div className="w-full">
                    <UpdateInputField
                        label="Email"
                        type='email'
                        icon={<Mail size={18}/>}
                        valueName={formData.email}
                        id="email"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full">
                    <UpdateInputField
                        label="Mobile Number"
                        type='phone'
                        icon={<Phone size={18}/>}
                        valueName={formData.phoneNumber}
                        id="phoneNumber"
                        onChange={handleChange}
                    />
                </div>
                
            </div>

            <p className='text-red-800 text-sm mb-5'>{errMsg}</p>
            
            <div className="flex justify-end">
                <button 
                    type='submit' 
                    className='bg-priColor px-8 py-3 rounded-sm text-white text-xs font-[500]'>
                    Submit
                </button>
            </div>

        </form>
    </CustomModal>
  )
}

export default AddUserForm

AddUserForm.propTypes = {
    handleModalClose: PropTypes.func,
};