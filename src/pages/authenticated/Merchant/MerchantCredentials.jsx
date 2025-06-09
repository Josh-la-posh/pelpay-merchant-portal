import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import MerchantService from '@/services/api/merchantApi';
import { Eye } from 'lucide-react';
import useAuth from '@/services/hooks/useAuth';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import PaymentForm from './components/merchantCredential/PaymentForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function MerchantCredential() {
  const { auth } = useAuth();
  const merchantCode = auth?.merchant?.merchantCode;
  const { setAppTitle } = useTitle();
  const { setSettingsTitle } = useSettingsTitle();
  const axiosPrivate = useAxiosPrivate();
  const merchantService = new MerchantService(axiosPrivate);
  const dispatch = useDispatch();
  const { merchantCredentials, merchantCredentialsLoading, merchantCredentialsError } = useSelector((state) => state.merchant);
  const credential = merchantCredentials?.integrations;
  const [userData, setUserData] = useState(credential);
  const [viewSecret, setViewSecret] = useState(false);
  const [viewKey, setViewKey] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [selectedIntegrationKey, setSelectedIntegrationKey] = useState('');
  
  const [isLoading, setIsLoading] = useState(merchantCredentialsLoading);
  const [errMsg, setErrMsg] = useState(merchantCredentialsError);

  useEffect(() => {
      setAppTitle('Merchant');
      setSettingsTitle('Credential')
  }, []);

  useEffect(() => {
    setUserData(credential);
  }, [merchantCredentials])
            
  useEffect(() => {
    setIsLoading(merchantCredentialsLoading);
  }, [merchantCredentialsLoading]);
      
  useEffect(() => {
      setErrMsg(merchantCredentialsError);
  }, [merchantCredentialsError]);

  useEffect(() => {
    loadData();
  }, [merchantCode, dispatch]);

  const handleRefresh = () => {
      loadData();
  }
  
  const loadData = async () => {
      await merchantService.fetchMerchantCredentials(merchantCode, dispatch);
  };

  const handleIntegrationKey = (index) => {
    setViewKey((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  const handlePayment = async (index) => {
    try {
      const response = await axios.post(
        'https://api.pelpay.ng/api/account/login',
        {
          clientId: merchantCredentials?.clientId,
          clientSecret: merchantCredentials?.clientSecret
        }
      );
      setSelectedIntegrationKey(userData[index].integrationKey);
      const data = response.data.access_token;
      setAccessToken(data);
      setIsModalOpen(true);
    } catch (e) {
      toast('An error occurred. Try again later');
    }


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
    <div>
      <div className="bg-white p-4">
        <div className="">
          <div className="flex border-b border-b-gray-300 py-4">
            <p className='text-xs flex-1'>Client ID</p>
            <p className='text-xs flex-1'>Client Secret</p>
            <p className='flex-1 text-xs'></p>
          </div>
          <div className="flex border-b border-b-gray-300 py-4 text-xs">
            <p className='flex-1'>{merchantCredentials?.clientId}</p>
            <div className='flex-1 flex items-center gap-5'>
              {merchantCredentials?.clientSecret && viewSecret === true ? merchantCredentials?.clientSecret : '************'}
              <button onClick={() => setViewSecret(!viewSecret)} className='text-priColor'><Eye size={'15px'} /></button>
            </div>
            <p className='flex-1 text-xs'></p>
          </div>
        </div>
        <div className="flex justify-center mt-8 mb-4">
          Integration Settings
        </div>
        <div className="">   
          <div className="flex border-b border-b-gray-300 py-4">
            <p className='flex-1 text-xs'>Environment</p>
            <p className='flex-1 text-xs'>Integration Key</p>
            <p className='flex-1 text-xs'></p>
          </div>
        </div>

        { userData &&
          userData.map((data, index) => (
            <div key={index} className="flex border-b border-b-gray-300 py-4 text-xs">
              <p className='flex-1'>{data?.env === 'Test' ? 'Sandbox' : 'Production'}</p>
              <div className='flex-1 flex items-center gap-5'>
                {viewKey[index] === true ? data?.integrationKey : '************'}
                <button onClick={() => handleIntegrationKey(index)} className='text-priColor'><Eye size={'15px'} /></button>
              </div>
              <button onClick={() => handlePayment(index)} className='text-priColor flex-1'>Make Payment</button>
            </div>
          ))
        }
      </div>

      {isModalOpen && 
        (<PaymentForm 
          selectedIntegrationKey={selectedIntegrationKey}
          accessToken={accessToken} 
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default MerchantCredential;