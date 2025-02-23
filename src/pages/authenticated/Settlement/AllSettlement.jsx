import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import SettlementService from '@/services/api/settlementApi';
import SettlementTable from './components/settlementTable';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function AllSettlementPage() {
  const { setAppTitle } = useTitle();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { settlement, settlementLoading, settlementError } = useSelector(state => state.settlement);
  const merchantCode = auth?.merchant.merchantCode;
  const settlementservice = new SettlementService(axiosPrivate);
  const [filteredData, setFilteredData] = useState(settlement);
  const [isLoading, setIsLoading] = useState(settlementLoading);
  const [errMsg, setErrMsg] = useState(settlementError);
  const pageNumber = 1;
  const pageSize = 40;

  useEffect(() => {
      setAppTitle('Settlements');
  }, []);
            
  useEffect(() => {
    setFilteredData(settlement);
  }, [settlement]);
          
  useEffect(() => {
    setIsLoading(settlementLoading);
  }, [settlementLoading]);
      
  useEffect(() => {
      setErrMsg(settlementError);
  }, [settlementError]);

  useEffect(() => {
    loadData();
  }, [merchantCode, pageNumber, pageSize, dispatch]);

  const handleRefresh = () => {
      loadData();
  }
  
  const loadData = async () => {
    if (merchantCode) {
      await settlementservice.fetchSettlement(merchantCode, pageNumber, pageSize, dispatch);
    }
  };

  if (isLoading) return (
      <div className='h-[80vh] w-full'>
          <Spinner />
      </div>
  );

  if (errMsg !== null) return (
      <div className='h-[40vh] w-full'>
          <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />
      </div>
  );

  return (
    <div className='space-y-4'>
      {/* <SettlementFilter /> */}
      
      <button onClick={() => navigate(-1)} className='text-priColor mb-5 flex items-center gap-2 text-xs'><ArrowLeft size={'14px'}/> Go Back</button>
      <SettlementTable filteredData={filteredData} merchantCode={merchantCode}/>
    </div>
  )
}

export default AllSettlementPage;