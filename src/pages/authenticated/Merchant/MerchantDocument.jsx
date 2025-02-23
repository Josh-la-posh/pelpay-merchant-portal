import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import MerchantService from '@/services/api/merchantApi';
import MerchantDocumentTable from './components/merchantDocument/MerchantDocumentTable';
import MerchantDocumentFilter from './components/merchantDocument/MerchantDocumentFilter';
import useAuth from '@/services/hooks/useAuth';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function MerchantDocument() {
  const { auth } = useAuth();
  const merchantCode = auth?.merchant?.merchantCode;
  const { setAppTitle } = useTitle();
  const { setSettingsTitle } = useSettingsTitle();
  const axiosPrivate = useAxiosPrivate();
  const merchantService = new MerchantService(axiosPrivate);
  const dispatch = useDispatch();
  const { merchantDocument, merchantDocumentError, merchantDocumentLoading } = useSelector((state) => state.merchant);
  const [filteredData, setFilteredData] = useState(merchantDocument);
  const [isLoading, setIsLoading] = useState(merchantDocumentLoading);
  const [errMsg, setErrMsg] = useState(merchantDocumentError);

  useEffect(() => {
      setAppTitle('Merchant');
      setSettingsTitle('Document');
  }, []);
          
  useEffect(() => {
    setFilteredData(merchantDocument);
  }, [merchantDocument]);
          
  useEffect(() => {
    setIsLoading(merchantDocumentLoading);
  }, [merchantDocumentLoading]);
      
  useEffect(() => {
      setErrMsg(merchantDocumentError);
  }, [merchantDocumentError]);

  useEffect(() => {
    loadData();
  }, [merchantCode, dispatch]);

  const handleRefresh = () => {
      loadData();
  }
  
  const loadData = async () => {
      await merchantService.fetchMerchantDocument(merchantCode, dispatch);
  };

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
    <div className=''>
      <MerchantDocumentFilter />
      <MerchantDocumentTable filteredData={filteredData} merchantCode={merchantCode} />
    </div>
  )
}

export default MerchantDocument;