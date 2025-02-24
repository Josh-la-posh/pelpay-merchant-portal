import React, { useState, useRef, useEffect } from 'react';
import '../auth.css';
import { Link } from 'react-router-dom';
import AuthInputField from '@/components/AuthInptField';
import axios from '@/services/api/axios';
import { toast } from 'react-toastify';
// import Logo from '@/assets/logo.jpg';
import { CheckCircle, Home, Mail, Phone, User } from 'lucide-react';

const BUSINESS_REGEX = /^[a-zA-Z0-9\s\-']{3,50}$/;
const NAME_REGEX = /^[a-zA-Z]{2,24}$/;
// const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_@]{3,24}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{7,24}$/;
const PHONE_REGEX = /^[0-9\s\-()]{10,15}$/;
const EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const REGISTER_URL = '/api/onboard-merchant';

const RegisterForm = () => {
    // const userRef = useRef();
    // const emailRef = useRef();
    const [countryList, setCountryList] = useState([]);
    const [showCountryListReload, setShowCountryListReload] = useState(false);
    const [industryList, setIndustryList] = useState([]);
    const [showIndustryListReload, setShowIndustryListReload] = useState(false);
    const [industryCategoryList, setIndustryCategoryList] = useState([]);
    const [showIndustryCategoryListReload, setShowIndustryCategoryListReload] = useState(false);
    const [showIndustryCategories, setShowIndustryCategories] = useState(false);
    const [industryId, setIndustryId] = useState(null);
    const errRef = useRef();

    const [validBusinessName, setValidBusinessName] = useState(false);
    const [businessNameFocus, setBusinessNameFocus] = useState(false);

    const [validContactEmail, setValidContactEmail] = useState(false);
    const [contactEmailFocus, setContactEmailFocus] = useState(false);

    const [validContactPhoneNumber, setValidContactPhoneNumber] = useState(false);
    const [contactPhoneNumberFocus, setContactPhoneNumberFocus] = useState(false);

    const [validContactFirstName, setValidContactFirstName] = useState(false);
    const [contactFirstNameFocus, setContactFirstNameFocus] = useState(false);

    const [validContactLastName, setValidContactLastName] = useState(false);
    const [contactLastNameFocus, setContactLastNameFocus] = useState(false);

    // const [validIndustryCategoryId,setValidIndustryCategoryId] = useState(false);
    // const [industryCategoryIdFocus,setIndustryCategoryIdFocus] = useState(false);

    // const [validCountry,setValidCountry] = useState(false);
    // const [countryFocus,setCountryFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    const [formData, setFormData] = useState({
        country: 'NG',
        businessName: '',
        contactEmail: '',
        contactPhoneNumber: '',
        contactFirstName: '',
        contactLastName: '',
        industryCategoryId: 1,
    });

    const getCountry = async () => {
        // e.preventDefault();
        try {
            const response = await axios.get('api/country');
            if (response.data.message === 'Successful') {
                setCountryList(response.data.responseData);
                setShowCountryListReload(false);
            } else {
                setShowCountryListReload(true);
            }
        } catch (err) {
            setShowCountryListReload(true);
        }
    }

    const getIndustry = async () => {
        // e.preventDefault();
        try {
            const response = await axios.get('api/industry');
            if (response.data.message === 'Successful') {
                setIndustryList(response.data.responseData);
                setShowIndustryListReload(false);
            } else {
                setShowIndustryListReload(true);
            }
        } catch (err) {
            setShowIndustryListReload(true);
        }
    }

    const getIndustryCategories = async (id) => {
        try {
            const response = await axios.get(`api/industry/categories/${id}`);
            if (response.data.message === 'Successful') {
                setIndustryCategoryList(response.data.responseData);
                setShowIndustryCategoryListReload(false);
            } else {
                setShowIndustryCategoryListReload(true);
            }
        } catch (err) {
            setShowIndustryCategoryListReload(true);
        }
    }

    useEffect(() =>  {
        if (countryList.length < 1) {
            getCountry();
        }
        getIndustry();
    }, [])

    useEffect(() => {
        const result = BUSINESS_REGEX.test(formData.businessName);
        setValidBusinessName(result);
    }, [formData.businessName])

    useEffect(() => {
        const result = EMAIL_REGEX.test(formData.contactEmail);
        setValidContactEmail(result);
    }, [formData.contactEmail])

    useEffect(() => {
        const result = PHONE_REGEX.test(formData.contactPhoneNumber);
        setValidContactPhoneNumber(result);
    }, [formData.contactPhoneNumber])

    useEffect(() => {
        const result = NAME_REGEX.test(formData.contactFirstName);
        setValidContactFirstName(result);
    }, [formData.contactFirstName])

    useEffect(() => {
        const result = NAME_REGEX.test(formData.contactLastName);
        setValidContactLastName(result);
    }, [formData.contactLastName])

    useEffect(() => {
        setErrMsg('');
    }, [formData.businessName, formData.contactEmail, formData.contactFirstName, formData.contactLastName, formData.contactPhoneNumber])

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCategoryChange = (e) => {
        setIndustryId(e.target.value);
        getIndustryCategories(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1 = BUSINESS_REGEX.test(formData.businessName);
        const v2 = EMAIL_REGEX.test(formData.contactEmail);
        const v3 = PHONE_REGEX.test(formData.contactPhoneNumber);
        const v4 = NAME_REGEX.test(formData.contactFirstName);
        const v5 = NAME_REGEX.test(formData.contactLastName);


        if (!v1 || !v2 || !v3 || !v4 || !v5) {
            setErrMsg('Invalid Entry');
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify(formData),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                })
            setSuccess(true);
            toast.success("Registration successful! Please check your email to confirm your account.");

            // Clear the form fields after successful submission
            setFormData({
                country: 'NG',
                businessName: '',
                contactEmail: '',
                contactPhoneNumber: '',
                contactFirstName: '',
                contactLastName: '',
                industryCategoryId: 1,
            });

        } catch (err) {
            if (err.response.status === 400) {
                toast(err.response.data.message);
            } else if (!err.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('An error occured. Try again later');
            }

            errRef.current.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {
                success ? (
                    <section className='pt-16'>
                        <div className='flex items-center justify-center h-[120px] mb-3'>
                            <CheckCircle size='15px' className='text-green-600' />
                        </div>
                        <p className='mb-4 text-[12px] text-center'>Your account has been created successfully!!!.</p>
                        <p className='mb-8 text-sm text-center'>Kindly follow the link send to your email for account activation.</p>

                        <div className="text-center">
                            <Link to="/login" className="text-xs lg:text-sm text-black hover:underline">Otherwise, proceed to <span className='text-priColor'>Log in</span></Link>
                        </div>

                    </section>
                ) : (
                    <section className="pt-8 overflow-x-scroll">
                        <p ref={errRef} className={errMsg ? "errmsg" :
                            "offscreen"} aria-live='asserive'>{errMsg}</p>

                        <div className="lg:flex justify-center mb-8">
                            <img src='/assets/logo.jpg' />
                        </div>
                        <h2 className="text-2xl font-semibold mt-6 mb-4">Register</h2>
                        <h2 className="text-[15px] text-black/60 mb-6">Kindly fill the field below to login</h2>
                        <form onSubmit={handleSubmit}>
                            <AuthInputField
                                label="Business Name"
                                type='text'
                                icon={<Home size='15px' />}
                                validName={validBusinessName}
                                valueName={formData.businessName}
                                id="businessName"
                                onChange={handleChange}
                                setOnFocus={setBusinessNameFocus}
                                nameFocus={businessNameFocus}
                                errNote={(
                                    <>
                                        Business name is required.
                                        <br />
                                        Business name must be between 3 and 50 characters.
                                        <br />
                                        Business name can only contain letters, numbers, spaces, hyphens, and apostrophes.
                                        <br />
                                        Business name cannot start or end with a space.
                                    </>
                                )}
                            />
                            <div className="block md:flex md:space-x-4">
                                <AuthInputField
                                    label="Email"
                                    type='email'
                                    icon={<Mail size='15px' />}
                                    validName={validContactEmail}
                                    valueName={formData.contactEmail}
                                    id="contactEmail"
                                    onChange={handleChange}
                                    setOnFocus={setContactEmailFocus}
                                    nameFocus={contactEmailFocus}
                                    errNote={(
                                        <>
                                            Enter a valid email address
                                        </>
                                    )}
                                />
                                
                                <AuthInputField
                                    label="Phone Number"
                                    type='tel'
                                    icon={<Phone size='15px' />}
                                    validName={validContactPhoneNumber}
                                    valueName={formData.contactPhoneNumber}
                                    id="contactPhoneNumber"
                                    onChange={handleChange}
                                    setOnFocus={setContactPhoneNumberFocus}
                                    nameFocus={contactPhoneNumberFocus}
                                    errNote={(
                                        <>
                                            Please enter a valid phone number (10 to 15 digits).
                                        </>
                                    )}
                                />

                            </div>
                            <div className="block md:flex md:space-x-4">

                                <AuthInputField
                                    label="First Name"
                                    type='text'
                                    icon={<User size='15px' />}
                                    validName={validContactFirstName}
                                    valueName={formData.contactFirstName}
                                    id="contactFirstName"
                                    onChange={handleChange}
                                    setOnFocus={setContactFirstNameFocus}
                                    nameFocus={contactFirstNameFocus}
                                    errNote={(
                                        <>
                                            First name is required.
                                            <br />
                                            First name must be between 2 and 24 characters.
                                            <br />
                                            First name can only contain letters and .
                                            <br />
                                            First name cannot contain spaces.
                                        </>
                                    )}
                                />

                                <AuthInputField
                                    label="Last Name"
                                    type='text'
                                    icon={<User size='15px' />}
                                    validName={validContactLastName}
                                    valueName={formData.contactLastName}
                                    id="contactLastName"
                                    onChange={handleChange}
                                    setOnFocus={setContactLastNameFocus}
                                    nameFocus={contactLastNameFocus}
                                    errNote={(
                                        <>
                                            Last name is required.
                                            <br />
                                            Last name must be between 2 and 24 characters.
                                            <br />
                                            Last name can only contain letters and .
                                            <br />
                                            Last name cannot contain spaces.
                                        </>
                                    )}
                                />
                            </div>
                            <div className="block md:flex md:space-x-4 mb-6">
                                <div className="mb-6 w-full">
                                    <label className="text-black text-[11px] lg:text-[13px] mb-1 lg:mb-2 flex items-center" htmlFor="country">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                                        required
                                    >
                                        {countryList.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.countryName}
                                            </option>
                                        ))}
                                    </select>
                                    {showCountryListReload && <div className="w-full mt-2">
                                        <Link to='' onClick={getCountry} className='text-priColor text-xs text-right cursor'>Retry</Link>
                                    </div>}
                                </div>
                                <div className="mb-6 w-full">
                                    <label className="text-black text-[11px] lg:text-[13px] mb-1 lg:mb-2 flex items-center" htmlFor="industry">
                                        Industry
                                    </label>
                                    <select
                                        id="industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={(e) => handleCategoryChange(e)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                                        required
                                    >
                                        {industryList.map((industry) => (
                                            <option key={industry.id} value={industry.id}>
                                                {industry.industryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {
                                industryId !== null &&
                                <div className="mb-6 w-full">
                                    <label className="text-black text-[11px] lg:text-[13px] mb-1 lg:mb-2 flex items-center" htmlFor="industryCategoryId">
                                        Industry Category
                                    </label>
                                    <select
                                        id="industryCategoryId"
                                        name="industryCategoryId"
                                        value={formData.industryCategoryId}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                                        required
                                    >
                                        {industryCategoryList.map((industry) => (
                                            <option key={industry.id} value={industry.id}>
                                                {industry.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            }
                            <button
                                type="submit"
                                className="w-full bg-priColor text-sm text-white py-2 rounded-lg"
                                // disabled={loading || !validBusinessName || !validContactEmail || !validContactFirstName || !validContactLastName || !validContactPhoneNumber ? true : false}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                            <div className="text-center mt-4 mb-10">
                                <Link to="/login" className="text-xs lg:text-sm">Already have an account? <span className='text-priColor hover:underline'> Log In</span></Link>
                            </div>
                        </form>
                    </section>)
            }
        </>
    );
};

export default RegisterForm;