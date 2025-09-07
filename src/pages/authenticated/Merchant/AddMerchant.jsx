import { useEffect, useRef, useState, useCallback } from 'react'
import useTitle from '@/services/hooks/useTitle';
import AuthInputField from '@/components/AuthInptField';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import Button from '../../../components/ui/button';

const BUSINESS_REGEX = /^[a-zA-Z0-9\s\-']{3,50}$/;
const NAME_REGEX = /^[a-zA-Z]{2,24}$/;
const ACCOUNT_REGEX = /^[a-zA-Z]{10}$/;
const PHONE_REGEX = /^[0-9\s\-()]{10,15}$/;
const EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function AddMerchantPage() {
    const { setSettingsTitle } = useSettingsTitle();
    const { setAppTitle } = useTitle();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        setAppTitle('Merchant');
        setSettingsTitle('New')
    }, [setAppTitle, setSettingsTitle]);

    const [countryList, setCountryList] = useState([]);
    const [showCountryListReload, setShowCountryListReload] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [industryList, setIndustryList] = useState([]);
        const [, setShowIndustryListReload] = useState(false);
        const [industryCategoryList, setIndustryCategoryList] = useState([]);
        const [, setShowIndustryCategoryListReload] = useState(false);
        // showIndustryCategories not needed here; industryId controls whether categories are shown
    const [industryId, setIndustryId] = useState(null);
    const errRef = useRef();

    const [validBusinessName, setValidBusinessName] = useState(false);
    const [businessNameFocus, setBusinessNameFocus] = useState(false);

    const [validContactEmail, setValidContactEmail] = useState(false);
    const [contactEmailFocus, setContactEmailFocus] = useState(false);

    const [validSupportEmail, setValidSupportEmail] = useState(false);
    const [supportEmailFocus, setSupportEmailFocus] = useState(false);

    const [validDisputeEmail, setValidDisputeEmail] = useState(false);
    const [disputeEmailFocus, setDisputeEmailFocus] = useState(false);

    const [validBusinessEmail, setValidBusinessEmail] = useState(false);
    const [businessEmailFocus, setBusinessEmailFocus] = useState(false);

    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

    const [validWebsite, setValidWebsite] = useState(false);
    const [websiteFocus, setWebsiteFocus] = useState(false);

    const [validBvn, setValidBvn] = useState(false);
    const [bvnFocus, setBvnFocus] = useState(false);

    const [validPostalCode] = useState(false);
    const [postalCodeFocus, setPostalCodeFocus] = useState(false);


    const [validAccountBalance] = useState(false);
    const [accountBalanceFocus, setAccountAmountFocus] = useState(false);

    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);

    const [validBusinessDescription, setValidBusinessDescription] = useState(false);
    const [businessDescriptionFocus, setBusinessDescriptionFocus] = useState(false);

    const [validReturnUrl, setValidReturnUrl] = useState(false);
    const [returnUrlFocus, setReturnUrlFocus] = useState(false);

    const [validNotificationURL, setValidNotificationURL] = useState(false);
    const [notificationURLFocus, setNotificationURLFocus] = useState(false);

    // const [validIndustryCategoryId,setValidIndustryCategoryId] = useState(false);
    // const [industryCategoryIdFocus,setIndustryCategoryIdFocus] = useState(false);

    // const [validCountry,setValidCountry] = useState(false);
    // const [countryFocus,setCountryFocus] = useState(false);

    const [, setErrMsg] = useState('');
    const [, setSuccess] = useState(false);


    const [formData, setFormData] = useState({
        businessName: '',
        industryCategoryId: 1,
        contactEmail: '',
        supportEmail: '',
        disputeEmail: '',
        businessEmail: '',
        phoneNumber: '',
        website: '',
        bvn: '',
        accountBalance: 0,
        address: '',
        stateCode: '',
        postalCode: '',
        countryCode: '',
        businessDescription: '',
        returnUrl: '',
        notificationURL: '',
    });

    const getCountry = useCallback(async () => { 
        try {
            const response = await axiosPrivate.get('api/country');
            if (response.data.message === 'Successful') {
                const responseData = response.data.responseData || [];
                setCountryList(responseData);

                // pick first available states safely
                const selectedStateList = (responseData[0] && responseData[0].states) ? responseData[0].states : [];
                setStateList(selectedStateList);
                setShowCountryListReload(false);
            } else {
                setShowCountryListReload(true);
            }
        } catch (err) {
            console.error(err);
            setShowCountryListReload(true);
        }
    }, [axiosPrivate]);

    const getIndustryCategories = useCallback(async (id) => {
        try {
            const response = await axiosPrivate.get(`api/industry/categories/${id}`);
            if (response.data.message === 'Successful') {
                const result = response.data.responseData;
                setIndustryCategoryList(result);        
                setFormData((prevState) => ({
                    ...prevState,
                    industryCategoryId: result[0]?.id || prevState.industryCategoryId || 1,
                }));
                // no-op: industryId controls visibility in this component
                setShowIndustryCategoryListReload(false);
            } else {
                setShowIndustryCategoryListReload(true);
                // no-op: industryId controls visibility in this component
            }
        } catch (err) {
            console.error(err);
            setShowIndustryCategoryListReload(true);
            // no-op: industryId controls visibility in this component
        }
    }, [axiosPrivate]);

    const getIndustry = useCallback(async () => {
        try {
            const response = await axiosPrivate.get('api/industry');
            if (response.data.message === 'Successful') {
                const result = response.data.responseData || [];
                setIndustryList(result);
                if (result.length) getIndustryCategories(result[0].id);
                setShowIndustryListReload(false);
            } else {
                setShowIndustryListReload(true);
            }
        } catch (err) {
            console.error(err);
            setShowIndustryListReload(true);
        }
    }, [axiosPrivate, getIndustryCategories]);

    useEffect(() =>  {
        getCountry();
    }, [getCountry])

    useEffect(() =>  {
        getIndustry();
    }, [getIndustry])

    useEffect(() => {
        const result = BUSINESS_REGEX.test(formData.businessName);
        setValidBusinessName(result);
    }, [formData.businessName])

    useEffect(() => {
        const result = EMAIL_REGEX.test(formData.contactEmail);
        setValidContactEmail(result);
    }, [formData.contactEmail])

    useEffect(() => {
        const result = EMAIL_REGEX.test(formData.supportEmail);
        setValidSupportEmail(result);
    }, [formData.supportEmail])

    useEffect(() => {
        const result = EMAIL_REGEX.test(formData.disputeEmail);
        setValidDisputeEmail(result);
    }, [formData.disputeEmail])

    useEffect(() => {
        const result = EMAIL_REGEX.test(formData.businessEmail);
        setValidBusinessEmail(result);
    }, [formData.businessEmail])

    useEffect(() => {
        const result = PHONE_REGEX.test(formData.phoneNumber);
        setValidPhoneNumber(result);
    }, [formData.phoneNumber])

    useEffect(() => {
        const result = formData.website.length > 4;
        setValidWebsite(result);
    }, [formData.website])

    useEffect(() => {
        const result = ACCOUNT_REGEX.test(formData.bvn);
        setValidBvn(result);
    }, [formData.bvn])

    // account number validation not currently used in UI; removed to silence lint

    useEffect(() => {
        const result = formData.address.length > 4;
        setValidAddress(result);
    }, [formData.address])

    useEffect(() => {
        const result = formData.businessDescription.length > 4;
        setValidBusinessDescription(result);
    }, [formData.businessDescription])

    useEffect(() => {
        const result = formData.returnUrl.length > 4;
        setValidReturnUrl(result);
    }, [formData.returnUrl])

    useEffect(() => {
        const result = formData.notificationURL.length > 4;
        setValidNotificationURL(result);
    }, [formData.notificationURL])

    useEffect(() => {
        setErrMsg('');
    }, [
        formData.businessName,
        formData.industryCategoryId,
        formData.contactEmail,
        formData.supportEmail,
        formData.disputeEmail,
        formData.businessEmail,
        formData.phoneNumber,
        formData.website,
        formData.bvn,
        formData.accountBalance,
        formData.address,
        formData.stateCode,
        formData.postalCode,
        formData.countryCode,
        formData.businessDescription,
        formData.returnUrl,
        formData.notificationURL,
        ])

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
  
    const handleCountryChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        const found = Array.isArray(countryList) ? countryList.find(country => country.id === e.target.value) : null;
        setStateList(found?.states || []);
    }

    const handleStateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

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
            await axiosPrivate.post('',
                JSON.stringify(formData),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                })
            setSuccess(true);
            toast.success("Registration successful! Please check your email to confirm your account.");

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
        <div className=''>
            <div className="bg-white p-5">
                <form onSubmit={handleSubmit}>
                    <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
                        <AuthInputField
                            label="Business Name"
                            type='text'
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
                        <AuthInputField
                            label="Business Email"
                            type='email'
                            validName={validBusinessEmail}
                            valueName={formData.businessEmail}
                            id="businessEmail"
                            onChange={handleChange}
                            setOnFocus={setBusinessEmailFocus}
                            nameFocus={businessEmailFocus}
                            errNote={(
                                <>
                                    Enter a valid business email address
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Contact Email"
                            type='email'
                            validName={validContactEmail}
                            valueName={formData.contactEmail}
                            id="contactEmail"
                            onChange={handleChange}
                            setOnFocus={setContactEmailFocus}
                            nameFocus={contactEmailFocus}
                            errNote={(
                                <>
                                    Enter a valid contact email address
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Address"
                            type='text'
                            validName={validAddress}
                            valueName={formData.address}
                            id="address"
                            onChange={handleChange}
                            setOnFocus={setAddressFocus}
                            nameFocus={addressFocus}
                            errNote={(
                                <>
                                    Address is required.
                                </>
                            )}
                        />
                        <div className="w-full">
                            <label className="text-black text-xs mb-1 lg:mb-2 flex items-center" htmlFor="country">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                value={formData.countryCode}
                                onChange={handleCountryChange}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
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
                        
                        <div className="w-full">
                            <label className="mb-1 lg:mb-2 text-xs flex items-center" htmlFor="state">
                                State
                            </label>
                            <select
                                id="stateCode"
                                name="stateCode"
                                value={formData.stateCode}
                                onChange={(e) => handleStateChange(e)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                                required
                            >
                                {stateList.map((state) => (
                                    <option key={state.id} value={state.id}>
                                        {state.stateName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <AuthInputField
                            label="Postal Code"
                            type='text'
                            validName={validPostalCode}
                            valueName={formData.postalCode}
                            id="postalCode"
                            onChange={handleChange}
                            setOnFocus={setPostalCodeFocus}
                            nameFocus={postalCodeFocus}
                            errNote={(
                                <>
                                    Postal code is required.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Dispute Email"
                            type='email'
                            validName={validDisputeEmail}
                            valueName={formData.disputeEmail}
                            id="disputeEmail"
                            onChange={handleChange}
                            setOnFocus={setDisputeEmailFocus}
                            nameFocus={disputeEmailFocus}
                            errNote={(
                                <>
                                    Enter a valid dispute email address
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Support Email"
                            type='email'
                            validName={validSupportEmail}
                            valueName={formData.supportEmail}
                            id="supportEmail"
                            onChange={handleChange}
                            setOnFocus={setSupportEmailFocus}
                            nameFocus={supportEmailFocus}
                            errNote={(
                                <>
                                    Enter a valid support email address
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Phone Number"
                            type='tel'
                            validName={validPhoneNumber}
                            valueName={formData.phoneNumber}
                            id="phoneNumber"
                            onChange={handleChange}
                            setOnFocus={setPhoneNumberFocus}
                            nameFocus={phoneNumberFocus}
                            errNote={(
                                <>
                                    Please enter a valid phone number (10 to 15 digits).
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Website"
                            type='text'
                            validName={validWebsite}
                            valueName={formData.website}
                            id="website"
                            onChange={handleChange}
                            setOnFocus={setWebsiteFocus}
                            nameFocus={websiteFocus}
                            errNote={(
                                <>
                                    Website is required.
                                    <br />
                                    website cannot contain spaces.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="BVN"
                            type='text'
                            validName={validBvn}
                            valueName={formData.bvn}
                            id="bvn"
                            onChange={handleChange}
                            setOnFocus={setBvnFocus}
                            nameFocus={bvnFocus}
                            errNote={(
                                <>
                                    BVN is required.
                                    <br />
                                    BVN cannot contain spaces.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Account Balance"
                            type='text'
                            validName={validAccountBalance}
                            valueName={formData.accountBalance}
                            id="accountBalance"
                            onChange={handleChange}
                            setOnFocus={setAccountAmountFocus}
                            nameFocus={accountBalanceFocus}
                            errNote={(
                                <>
                                    Account Number is required.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Business Description"
                            type='text'
                            validName={validBusinessDescription}
                            valueName={formData.businessDescription}
                            id="businessDescription"
                            onChange={handleChange}
                            setOnFocus={setBusinessDescriptionFocus}
                            nameFocus={businessDescriptionFocus}
                            errNote={(
                                <>
                                    Business description is required.
                                    <br />
                                    Business description cannot contain spaces.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Return Url"
                            type='text'
                            validName={validReturnUrl}
                            valueName={formData.returnUrl}
                            id="returnUrl"
                            onChange={handleChange}
                            setOnFocus={setReturnUrlFocus}
                            nameFocus={returnUrlFocus}
                            errNote={(
                                <>
                                    Return url is required.
                                    <br />
                                    Return url cannot contain spaces.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Notification Url"
                            type='text'
                            validName={validNotificationURL}
                            valueName={formData.notificationURL}
                            id="notificationURL"
                            onChange={handleChange}
                            setOnFocus={setNotificationURLFocus}
                            nameFocus={notificationURLFocus}
                            errNote={(
                                <>
                                    Notification url is required.
                                    <br />
                                    Notification url cannot contain spaces.
                                </>
                            )}
                        />
                        <AuthInputField
                            label="Business Description"
                            type='text'
                            validName={validBusinessDescription}
                            valueName={formData.businessDescription}
                            id="businessDescription"
                            onChange={handleChange}
                            setOnFocus={setBusinessDescriptionFocus}
                            nameFocus={businessDescriptionFocus}
                            errNote={(
                                <>
                                    Business description is required.
                                    <br />
                                    Business description cannot contain spaces.
                                </>
                            )}
                        />
                        <div className="w-full">
                            <label className="text-black text-xs mb-1 lg:mb-2 flex items-center" htmlFor="industry">
                                Industry
                            </label>
                            <select
                                id="industry"
                                name="industry"
                                value={formData.industry}
                                onChange={(e) => handleCategoryChange(e)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                                required
                            >
                                {industryList.map((industry) => (
                                    <option key={industry.id} value={industry.id}>
                                        {industry.industryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {
                            industryId !== null &&
                            <div className="w-full">
                                <label className="text-black text-xs mb-1 lg:mb-2 flex items-center" htmlFor="industryCategoryId">
                                    Industry Category
                                </label>
                                <select
                                    id="industryCategoryId"
                                    name="industryCategoryId"
                                    value={formData.industryCategoryId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
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
                    </div>
                    <Button
                        type='submit'
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default AddMerchantPage;