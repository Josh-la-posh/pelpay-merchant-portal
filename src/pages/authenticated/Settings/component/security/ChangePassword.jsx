import { useEffect, useState } from 'react';
import AuthInputField from '@/components/AuthInptField';
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{7,24}$/;

function ChangePassword() {
    // errRef not used currently; remove to silence lint until needed
    const [validCurrentPassword, setValidCurrentPassword] = useState(false);
    const [CurrentPasswordFocus, setCurrentPasswordFocus] = useState(false);

    const [validNewPassword, setValidNewPassword] = useState(false);
    const [NewPasswordFocus, setNewPasswordFocus] = useState(false);

    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [ConfirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        setValidCurrentPassword(formData.currentPassword);
    }, [formData.currentPassword])

    useEffect(() => {
        const result = PWD_REGEX.test(formData.newPassword);
        setValidNewPassword(result);
    }, [formData.newPassword])

    useEffect(() => {
        const result = formData.confirmPassword === formData.newPassword;
        setValidConfirmPassword(result);
    }, [formData.confirmPassword, formData.newPassword])

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const v1 = formData.currentPassword;
        const v2 = formData.newPassword;
        const v3 = formData.confirmPassword;

        if (v1 === '' && v2 === '' && v3 === '') {
            toast('No field must be empty');
            return;
        }

        if (v2 !== v3) {
            toast('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        toast('You are good to go');
        setTimeout(() => {
            setIsLoading(false);
        }, 2000)
    };

    return (
        <div className="mb-8  bg-white px-5 py-5">
            <h2 className="text-xl font-medium mb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInputField
                    label="Currenct Password"
                    type='password'
                    icon={<Lock size='15px' />}
                    placeholder='Current Password'
                    validName={validCurrentPassword}
                    valueName={formData.currentPassword}
                    id="currentPassword"
                    onChange={handleChange}
                    setOnFocus={setCurrentPasswordFocus}
                    nameFocus={CurrentPasswordFocus}
                />
                <AuthInputField
                    label="New Password"
                    type='password'
                    icon={<Lock size='15px' />}
                    placeholder='New Password'
                    validName={validNewPassword}
                    valueName={formData.newPassword}
                    id="newPassword"
                    onChange={handleChange}
                    setOnFocus={setNewPasswordFocus}
                    nameFocus={NewPasswordFocus}
                    errNote={(
                        <>
                            Password must be 7 and 24 characters
                            <br />
                            Password should contain a capital letter
                            <br />
                            Password should contain a small letter
                            <br />
                            Password should contain a number
                            <br />
                            Password should contain a special character
                        </>
                    )}
                />
                <AuthInputField
                    label="Current Password"
                    type='password'
                    icon={<Lock size='15px' />}
                    placeholder='Confirm Password'
                    validName={validConfirmPassword}
                    valueName={formData.confirmPassword}
                    id="confirmPassword"
                    onChange={handleChange}
                    setOnFocus={setConfirmPasswordFocus}
                    nameFocus={ConfirmPasswordFocus}
                    errNote={(
                        <>
                            Password do not match
                        </>
                    )}
                />
                <button 
                    type="submit"
                    className="py-3 px-6 bg-priColor text-xs text-white rounded-md"
                >
                    {isLoading ? 'Updating ...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
