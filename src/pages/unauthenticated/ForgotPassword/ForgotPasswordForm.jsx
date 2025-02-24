import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';
// import Logo from '@/assets/logo.jpg';
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
                    <div className="space-y-3">
                        <div className="lg:flex justify-center">
                            <img src='/assets/logo.jpg' />
                        </div>
                        <h2 className="text-2xl font-semibold">Forgot Password</h2>
                        <h2 className="text-[15px] text-black/60">Kindly enter your email address</h2>
                        <p ref={errRef} className={errMsg ? "errmsg" :
                            "offscreen"} aria-live='asserive'>{errMsg}</p>
                        <form onSubmit={handleForgotPassword} className='space-y-4'>
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
                            <button
                                type="submit"
                                className="w-full bg-priColor text-white py-2 rounded-lg mt-5"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Continue'}
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <Link to="/login" className="text-xs lg:text-sm">Go back to <span className='text-priColor hover:underline'> Log In</span></Link>
                        </div>
                    </div>
                ) :
                (
                    <div className="text-[13px] h-[screen]">
                        <div className="h-full flex flex-col justify-center items-center gap-6 pt-[20px] my-8">
                            <CheckCircle size='36px' className='text-green-600'/>
                            <p className='text-[13px] text-center'>"Kindly follow the link send to your email for password reset</p>
                            <Link to='/login' className='text-priColor hover:underline'>Proceed to Login page</Link>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ForgotPasswordForm;
