import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';
import Logo from '@/assets/logo.jpg';
import AuthInputField from '@/components/AuthInptField';
import AuthService from '@/services/api/authApi';
import { CheckCircle, User } from 'lucide-react';

const FORGOT_PASSWORD_URL = '/api/account/forget-password';
const EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPasswordForm = () => {
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isTokenSent, setIsTokenSent] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();
    const authService = new AuthService();

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        setErrMsg('');
        setSuccessMsg('');
    }, [email])

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        authService.submitForgotPassword(email, setLoading, setIsTokenSent, setSuccessMsg, setErrMsg, errRef);
    };

    return (
        <div className="pt-8">
            {
                !isTokenSent ?
                (
                    <div className="">
                        <div className="lg:flex justify-center">
                            <img src={Logo} />
                        </div>
                        <h2 className="text-2xl font-semibold mt-6 mb-4">Forgot Password</h2>
                        <h2 className="text-[15px] text-black text-opacity-60 mb-6">Kindly enter your email address</h2>
                        <p ref={errRef} className={errMsg ? "errmsg" :
                            "offscreen"} aria-live='asserive'>{errMsg}</p>
                        <form onSubmit={handleForgotPassword}>
                            <div className="mb-4">
                                <AuthInputField
                                    label="Email"
                                    type='email'
                                    icon={<User size='15px' />}
                                    validName={validEmail}
                                    valueName={email}
                                    id="contactEmail"
                                    onChange={(e) => setEmail(e.target.value)}
                                    setOnFocus={setEmailFocus}
                                    nameFocus={emailFocus}
                                    errNote={(
                                        <>
                                            Enter a valid email address
                                        </>
                                    )}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-priColor text-white py-2 rounded-lg mt-5"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Continue'}
                            </button>
                            <div className="text-center mt-4">
                                <Link to="/login" className="text-xs lg:text-sm">Go back to <span className='text-priColor hover:underline'> Log In</span></Link>
                            </div>
                        </form>
                    </div>
                ) :
                (
                    <div className="text-[13px]">
                        <div className="flex flex-col justify-center items-center gap-6 pt-[20px] my-8">
                            <CheckCircle size='32px' className='text-green-600'/>
                            <p className='text-[13px] text-center'>"Kindly follow the link send to your email for password reset</p>
                        </div>
                        <Link to='/login' className='text-priColor hover:underline'>Go back to Login</Link>
                    </div>
                )
            }
        </div>
    );
};

export default ForgotPasswordForm;
