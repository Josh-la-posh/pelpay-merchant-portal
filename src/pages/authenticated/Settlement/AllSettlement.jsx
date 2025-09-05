import { useEffect, useState, useMemo, useCallback } from 'react'
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
  const { settlement, settlementPageSize, settlementPageNumber, settlementTotalSize, settlementLoading, settlementError } = useSelector(state => state.settlement);
  const merchantCode = auth?.merchant.merchantCode;
  const settlementservice = useMemo(() => new SettlementService(axiosPrivate), [axiosPrivate]);
  const [filteredData, setFilteredData] = useState(settlement);
  const [isLoading, setIsLoading] = useState(settlementLoading);
  const [errMsg, setErrMsg] = useState(settlementError);
  const [pageNumber, setPageNumber] = useState(settlementPageNumber);
  const [pageSize, setPageSize] = useState(settlementPageSize);
  const [totalSize, setTotalSize] = useState(settlementTotalSize);

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
    setPageNumber(settlementPageNumber);
  }, [settlementPageNumber]);
      
  useEffect(() => {
    setPageSize(settlementPageSize);
  }, [settlementPageSize]);
      
  useEffect(() => {
    setTotalSize(settlementTotalSize);
  }, [settlementTotalSize]);

  const loadData = useCallback(async () => {
    if (merchantCode) {
      await settlementservice.fetchSettlement(merchantCode, pageNumber, pageSize, dispatch);
    }
  }, [merchantCode, pageNumber, pageSize, settlementservice, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    loadData();
  }

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
      <SettlementTable
        filteredData={filteredData}
        merchantCode={merchantCode}
        totalSize={totalSize}
        currentPage={pageNumber}
        setCurrentPage={setPageNumber}
        rowsPerPage={pageSize}
        setRowsPerPage={setPageSize}
      />
    </div>
  )
}

export default AllSettlementPage;