import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import MerchantService from '@/services/api/merchantApi';
import { useNavigate, useParams } from 'react-router-dom';
import AuthInputField from '@/components/AuthInptField';
import { ArrowLeft } from 'lucide-react';

function MerchantProfileUpdate() {
    const { merchantCode } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const merchantService = new MerchantService(axiosPrivate);
    const dispatch = useDispatch();
    const { 
        merchantBusinessTypes,
        merchantRegistrationTypes 
        } = useSelector((state) => state.merchant);
    const { merchantProfile } = useSelector((state) => state.merchant);

    // profile updte

    const [registrationTypes, setRegistrationTypes] = useState(merchantRegistrationTypes);
    const [businessTypes, setBusinessTypes] = useState(merchantBusinessTypes);
    const [industryList, setIndustryList] = useState([]);
    const [showIndustryListReload, setShowIndustryListReload] = useState(false);
    const [industryCategoryList, setIndustryCategoryList] = useState([]);
    const [showIndustryCategoryListReload, setShowIndustryCategoryListReload] = useState(false);
    const [showIndustryCategories, setShowIndustryCategories] = useState(false);

    // address update

    const [countryList, setCountryList] = useState([]);
    const [showCountryListReload, setShowCountryListReload] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    // profile data
    const [validBusinessDescription, setValidBusinessDescription] = useState(false);
    const [businessDescriptionFocus, setBusinessDescriptionFocus] = useState(false);

    const [validReturnUrl, setValidReturnUrl] = useState(false);
    const [returnUrlFocus, setReturnUrlFocus] = useState(false);

    const [validNotificationUrl, setValidNotificationUrl] = useState(false);
    const [notificationUrlFocus, setNotificationUrlFocus] = useState(false);

    const [validMerchantMCC, setValidMerchantMCC] = useState(false);
    const [merchantMCCFocus, setMerchantMCCFocus] = useState(false);

    // address data

    const [validMerchantAddress, setValidMerchantAddress] = useState(false);
    const [merchantAddressFocus, setMerchantAddressFocus] = useState(false);

    const [validMerchantCity, setValidMerchantCity] = useState(false);
    const [merchantCityFocus, setMerchantCityFocus] = useState(false);

    const [validPostalCode, setValidPostalCode] = useState(false);
    const [postalCodeFocus, setPostalCodeFocus] = useState(false);

    const [addressData, setAddressData] = useState({
        merchantAddress: merchantProfile.address ?? '',
        merchantCity: merchantProfile.city ?? '',
        merchantState: merchantProfile.state ?? '',
        postalCode: merchantProfile.postalCode ?? '',
    })

    const [formData, setFormData] = useState({
        businessDescription: merchantProfile.businessDescription ?? '',
        industryCategoryId: merchantProfile.industryCategoryId ?? 1,
        businessType: merchantProfile.businessType ?? 'None',
        registrationType: merchantProfile.registrationType ?? 'None',
        returnUrl: merchantProfile.returnUrl ?? '',
        notificationUrl: merchantProfile.notificationUrl ?? '',
        merchantMCC: merchantProfile.merchantMCC ?? '',
    });

    useEffect(() => {
        setAddressData({
            merchantAddress: merchantProfile.address ?? '',
            merchantCity: merchantProfile.city ?? '',
            merchantState: merchantProfile.state ?? '',
            postalCode: merchantProfile.postalCode ?? '',
        })

        setFormData({
            businessDescription: merchantProfile.businessDescription ?? '',
            industryCategoryId: merchantProfile.industryCategoryId ?? 1,
            businessType: merchantProfile.businessType ?? 'None',
            registerationType: merchantProfile.registrationType ?? 'None',
            returnUrl: merchantProfile.returnUrl ?? '',
            notificationUrl: merchantProfile.notificationUrl ?? '',
            merchantMCC: merchantProfile.merchantMCC ?? '',
        })
    }, [merchantProfile])

    useEffect(() => {
      const loadData = async () => {
        if (merchantCode) {
          await merchantService.fetchMerchantProfile(merchantCode, dispatch);
        }
      };
      loadData();
    }, [merchantCode, dispatch]);
    
    useEffect(() => {
        getCountry();
    }, [])
    
    useEffect(() => {
        getIndustry();
    }, [])
    
    useEffect(() => {
        setRegistrationTypes(merchantRegistrationTypes);
    }, [merchantRegistrationTypes])
    
    useEffect(() => {
        setBusinessTypes(merchantBusinessTypes);
    }, [merchantBusinessTypes])

    const getCountry = async () => {
        try {
            const response = await axiosPrivate.get('api/country');
            if (response.data.message === 'Successful') {
                setCountryList(response.data.responseData);

                const selectedStateList = response.data.responseData
                    .find(country => country.id === 'NG').states;
        
                setStateList(selectedStateList);
                setShowCountryListReload(false);
            } else {
                setShowCountryListReload(true);
            }
        } catch (err) {
            setShowCountryListReload(true);
        }
    }

    const getIndustry = async () => {
        try {
            const response = await axiosPrivate.get('api/industry');
            if (response.data.message === 'Successful') {
                const result = response.data.responseData;
                setIndustryList(result);
                getIndustryCategories(result[0].id)
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
            const response = await axiosPrivate.get(`api/industry/categories/${id}`);
            if (response.data.message === 'Successful') {
                const result = response.data.responseData;
                setIndustryCategoryList(result);      
                setFormData((prevState) => ({
                    ...prevState,
                    industryCategoryId: result[0].id,
                }));
                setShowIndustryCategories(true);
                setShowIndustryCategoryListReload(false);
            } else {
                setShowIndustryCategoryListReload(true);
                setShowIndustryCategories(false);
            }
        } catch (err) {
            setShowIndustryCategoryListReload(true);
            setShowIndustryCategories(false);
        }
    }
    
    useEffect(() => {
        getBusinessType();
    }, [])
    
    useEffect(() => {
        getRegistrationType();
    }, [])

    const getBusinessType = () => {
        merchantService.fetchMerchantProfileBusinessType(dispatch);
    }

    const getRegistrationType = () => {
        merchantService.fetchMerchantProfileRegistrationType(dispatch);
    }

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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

        const selectedStateList = countryList
            .find(country => country.id === e.target.value).states;

        setStateList(selectedStateList);
    }

    const handleStateChange = () => {}

    const handleCityChange = () => {}

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleWhitelistedChange = (e) => {
        const { name, value } = e.target;
    
        var result;

        if (value === 'true') {
            result = true;
        } else {
            result = false;
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: result,
        }));
        
    }

    const handleIndustryChange = (e) => {
        getIndustryCategories(e.target.value);
        var result = parseInt(e.target.value)
        setFormData((prevState) => ({
            ...prevState,
            industryCategoryId: result,
        }));
    }

    useEffect(() => {
        const result = addressData?.merchantAddress?.length > 3;
        setValidMerchantAddress(result);
    }, [addressData.merchantAddress]);

    useEffect(() => {
        const result = addressData?.merchantCity?.length > 1;
        setValidMerchantCity(result);
    }, [addressData.merchantCity]);

    useEffect(() => {
        const result = addressData?.postalCode?.length > 3;
        setValidPostalCode(result);
    }, [addressData.postalCode]);

    useEffect(() => {
        const result = formData?.businessDescription?.length > 3;
        setValidBusinessDescription(result);
    }, [formData.businessDescription]);

    useEffect(() => {
        const result = formData?.returnUrl?.length > 3;
        setValidReturnUrl(result);
    }, [formData.returnUrl]);

    useEffect(() => {
        const result = formData?.notificationUrl?.length > 3;
        setValidNotificationUrl(result);
    }, [formData.notificationUrl]);

    useEffect(() => {
        const result = formData?.merchantMCC?.length > 3;
        setValidMerchantMCC(result);
    }, [formData.merchantMCC]);

  useEffect(() => {
    const loadData = async () => {
      if (merchantCode) {
        await merchantService.fetchMerchantProfile(merchantCode, dispatch);
      }
    };
    loadData();
  }, [merchantCode, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    merchantService.updateMerchantProfile(merchantCode, formData, addressData, dispatch, navigate)
  }

  return (
    <div className="">   
        <button onClick={() => navigate(-1)} className='text-priColor mb-5 flex items-center gap-2 text-xs'><ArrowLeft size={'14px'}/> Go Back</button>
        <div className="py-10 px-5 bg-white h-full">
            <div className="mb-12 flex justify-between items-center">
                <p className='text-base font-[600]'>Update Merchant Profile</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 text-xs font-medium text-gray-700">
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
                            </>
                        )}
                    /> 
                    <AuthInputField
                        label="Address"
                        type='text'
                        validName={validMerchantAddress}
                        valueName={addressData.merchantAddress}
                        id="merchantAddress"
                        onChange={handleAddressChange}
                        setOnFocus={setMerchantAddressFocus}
                        nameFocus={merchantAddressFocus}
                        errNote={(
                            <>
                                Address is required.
                            </>
                        )}
                    />
                    {/* <div className="w-full">
                        <label className="mb-1 text-xs font-medium text-gray-700" htmlFor="country">
                            Country
                        </label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleCountryChange}
                            className="w-full px-3 py-2 text-xs border border-gra-300y rounded-lg focus:outline-none bg-transparent"
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
                    </div> */}
                    <div className="w-full">
                        <label className="text-xs font-medium text-gray-700" htmlFor="state">
                            State
                        </label>
                        <select
                            id="state"
                            name="state"
                            value={addressData.state}
                            onChange={(e) => handleStateChange(e)}
                            className="mt-1 w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                            required
                        >
                            {stateList.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.stateName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="w-full">
                        <label className="mb-1 text-xs font-medium text-gray-700" htmlFor="city">
                            City
                        </label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={(e) => handleCityChange(e)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                            required
                        >
                            {cityList.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.cityName}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    <AuthInputField
                        label="City"
                        type='text'
                        validName={validMerchantCity}
                        valueName={addressData.merchantCity}
                        id="merchantCity"
                        onChange={handleAddressChange}
                        setOnFocus={setMerchantCityFocus}
                        nameFocus={merchantCityFocus}
                        errNote={(
                            <>
                                City is required.
                            </>
                        )}
                    />
                    <AuthInputField
                        label="Postal Code"
                        type='text'
                        validName={validPostalCode}
                        valueName={addressData.postalCode}
                        id="postalCode"
                        onChange={handleAddressChange}
                        setOnFocus={setPostalCodeFocus}
                        nameFocus={postalCodeFocus}
                        errNote={(
                            <>
                                Postal code is required.
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
                                Return Url is required.
                            </>
                        )}
                    />
                    <AuthInputField
                        label="Notification Url"
                        type='text'
                        validName={validNotificationUrl}
                        valueName={formData.notificationUrl}
                        id="notificationUrl"
                        onChange={handleChange}
                        setOnFocus={setNotificationUrlFocus}
                        nameFocus={notificationUrlFocus}
                        errNote={(
                            <>
                                Notification Url is required.
                            </>
                        )}
                    />
                    <AuthInputField
                        label="Merchant MCC"
                        type='text'
                        validName={validMerchantMCC}
                        valueName={formData.merchantMCC}
                        id="merchantMCC"
                        onChange={handleChange}
                        setOnFocus={setMerchantMCCFocus}
                        nameFocus={merchantMCCFocus}
                        errNote={(
                            <>
                                Merchant MCC is required.
                            </>
                        )}
                    />
                    <div className="w-full">
                        <label className="text-xs font-medium text-gray-700" htmlFor="businessType">
                            Business Type
                        </label>
                        <select
                            id="businessType"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                            required
                        >
                            {businessTypes.map((reg, index) => (
                                <option key={index} value={reg}>
                                    {reg}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-medium text-gray-700" htmlFor="registerationType">
                            Registration Type
                        </label>
                        <select
                            id="registerationType"
                            name="registerationType"
                            value={formData.registerationType}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                            required
                        >
                            {registrationTypes.map((reg, index) => (
                                <option key={index} value={reg}>
                                    {reg}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-medium text-gray-700" htmlFor="industry">
                            Industry
                        </label>
                        <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={(e) => handleIndustryChange(e)}
                            className="mt-1 w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none bg-transparent"
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
                        showIndustryCategories &&
                        <div className="w-full">
                            <label className="mb-1 text-xs font-medium text-gray-700" htmlFor="industryCategoryId">
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
                <div className="flex justify-end">
                    <button type='submit ' className='text-white bg-priColor px-4 py-2 text-xs rounded-sm'>
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default MerchantProfileUpdate;