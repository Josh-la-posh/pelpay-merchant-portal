import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../auth.css';
import axios from '@/services/api/axios';
import AuthInputField from '@/components/AuthInptField';
import { CheckCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';

const CONFIRM_ACCOUNT_URL = 'api/account/confirm-account';
const RESEND_CONFIRM_ACCOUNT_URL = 'api/account/resend-confirm-account';
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{7,24}$/;

const VerifyEmailForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const errRef = useRef();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [shouldSend, setShouldSend] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [ConfirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPassword(result);
    }, [password])

    useEffect(() => {
        const result = confirmPassword === password;
        setValidConfirmPassword(result);
    }, [confirmPassword, password])

    useEffect(() => {
        setErrMsg('');
    }, [password, confirmPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess

        const v1 = PWD_REGEX.test(password);
        const v2 = confirmPassword === password;

        // getting the token from the url
        const currentUrl = window.location.href;
        const urlObj = new URL(currentUrl);

        const params = new URLSearchParams(urlObj.search);

        const token = params.get('token');

        if (!v1) {
            setErrMsg('Password validation Failed');
            return;
        }
        if (!v2) {
            setErrMsg('Password does not match');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(CONFIRM_ACCOUNT_URL,
                JSON.stringify({token, password, confirmPassword}),
                 {
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data;

            if (data.message !== '') {
                setSuccess(data.message);
            };
        } catch (error) {
            if (!error.response) {
                setErrMsg('No Server Response');
            }
        } finally {
            setLoading(false);
        }
    };

    const resendMail = async (e) => {
        e.preventDefault();
        setSuccess('');
        setIsSendingEmail(true);

        try {
            const response = await axios.post(RESEND_CONFIRM_ACCOUNT_URL,
                JSON.stringify({email}),
                 {
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data;

            if (data.message !== '') {
                setSuccess(data.message);
            };
        } catch (error) {
            if (!error.response) {
                setErrMsg('No Server Response');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-8">
            {success === '' ? 
                (
                    <div className="">
                        <div className="flex justify-center">
                            <img src='/assets/logo.jpg' />
                        </div>
                        <h2 className="text-2xl font-semibold mt-6 mb-4">Verify Account</h2>
                        <p ref={errRef} className={errMsg ? "errmsg" :
                            "offscreen"} aria-live='assertive'>{errMsg}</p>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className="relative">
                                <AuthInputField
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    icon={<Lock size='15px' />}
                                    validName={validPassword}
                                    valueName={password}
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    setOnFocus={setPasswordFocus}
                                    nameFocus={passwordFocus}
                                    errNote={passwordFocus && (
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
                                <button
                                    type="button"
                                    className="absolute right-2 top-8 text-xs text-gray-500"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size='15px' /> : <Eye size='15px' />}
                                </button>
                            </div>
                            <div className="relative">
                                <AuthInputField
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    icon={<Lock size='15px' />}
                                    validName={validConfirmPassword}
                                    valueName={confirmPassword}
                                    id="confirmPassword"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    setOnFocus={setConfirmPasswordFocus}
                                    nameFocus={ConfirmPasswordFocus}
                                    errNote={(
                                        <>
                                            Password does not match
                                        </>
                                    )}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-8 text-xs text-gray-500"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size='15px' /> : <Eye size='15px' />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-priColor text-white py-2 rounded-lg"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Submit'}
                            </button>
                        </form>
                        <div className="flex justify-center items-center mt-4">
                            <button onClick={() => setShouldSend(true)} className={`${shouldSend ? 'hidden' : 'block'} text-green-600 text-sm hover:underline`}>Resend verification link</button>
                            {shouldSend &&
                                <form onSubmit={resendMail} className='mt-4'>
                                    <div className="flex flex-col gap-2">
                                        <AuthInputField
                                            label="Email"
                                            type='email'
                                            icon={<Mail size='15px' />}
                                            validName={email.includes('@')}
                                            valueName={email}
                                            id="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            errNote={(
                                                <>
                                                    Please enter a valid email address
                                                </>
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-center mt-8">
                                        <button type="submit" className="w-full bg-priColor text-white py-2 rounded-lg" disabled={isSendingEmail}>
                                            {isSendingEmail ? 'Loading...' : 'Resend Verification Link'}
                                        </button>
                                    </div>
                                </form>
                            }
                        </div>
                        <div className="flex justify-center mt-8">
                            <Link to='/login' className='text-green-600 hover:underline mt-2 text-center'>Back to Login</Link>
                        </div>
                    </div>
                )
             :
                (
                    <div className="text-[13px]">
                        <div className="flex flex-col justify-center items-center gap-6 py-[20px] px-[40px] mb-4">
                            <CheckCircle size='32px' className='text-green-600' />
                            <p className='text-[13px] text-center'>{success}</p>
                        </div>                        
                        <div className="flex justify-center">
                            <Link to='/login' className='text-green-600 hover:underline'>Proceed to Login</Link>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default VerifyEmailForm;
