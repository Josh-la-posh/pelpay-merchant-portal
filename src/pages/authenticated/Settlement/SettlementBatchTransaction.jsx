import { useEffect, useState } from 'react';
import useAuth from '@/services/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import SettlementBatchTransactionTable from './components/SettlementBatchTransactionTable';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import SettlementService from '@/services/api/settlementApi';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function SettlementBatchTransaction() {
  const { transactionId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const settlementService = new SettlementService(axiosPrivate);
  const { settlementTransaction, batchSettlementPageSize, batchSettlementPageNumber, batchSettlementTotalSize, settlementLoading, settlementError } = useSelector(state => state.settlement);
  const [filteredData, setFilteredData] = useState(settlementTransaction);
  const [isLoading, setIsLoading] = useState(settlementLoading);
  const [errMsg, setErrMsg] = useState(settlementError);
  const navigate = useNavigate();
  const merchantCode = auth?.merchant.merchantCode;
  const merchantName = auth?.merchant.merchantName;
  const [pageNumber, setPageNumber] = useState(batchSettlementPageNumber);
  const [pageSize, setPageSize] = useState(batchSettlementPageSize);
  const [totalSize, setTotalSize] = useState(batchSettlementTotalSize);
  // const {env} = useSelector((state) => state.env);
  const env = 'Live';

  const [formData, setFormData] = useState({
      merchantName: merchantName || "",
      disputeStatus: "",
      processorName: "",
      sessionId: "",
      settlementStatus: "",
      transactionReference: "",
      accountNumber: "",
      startDate: "",
      endDate: "",
      merchantCode: merchantCode || "",
      status: "",
      customerEmail: ""
    
  });

  useEffect(() => {
    loadSettlementTransaction();
  }, [])

  useEffect(() => {
    setFilteredData(settlementTransaction);
  }, [settlementTransaction])
            
  useEffect(() => {
    setIsLoading(settlementLoading);
  }, [settlementLoading]);
      
  useEffect(() => {
      setErrMsg(settlementError);
  }, [settlementError]);
        
    useEffect(() => {
        setPageNumber(batchSettlementPageNumber);
    }, [batchSettlementPageNumber]);
        
    useEffect(() => {
        setPageSize(batchSettlementPageSize);
    }, [batchSettlementPageSize]);
        
    useEffect(() => {
        setTotalSize(batchSettlementTotalSize);
    }, [batchSettlementTotalSize]);

  const handleRefresh = () => {
    loadSettlementTransaction();
  }

  const loadSettlementTransaction = async () => {
    await settlementService.getSettlementBatchTransaction(pageNumber, pageSize, transactionId, env, formData, dispatch);
  }

  const downBatchSettlementTransaction = async () => {
    await settlementService.downloadSettlementBatchTransaction(pageNumber, pageSize, transactionId, env, formData)
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
    
      <button onClick={() => navigate(-1)} className='text-priColor mb-5 flex items-center gap-2 text-xs'><ArrowLeft size={'14px'}/> Go Back</button>
      <SettlementBatchTransactionTable
        filteredData={filteredData}
        merchantCode={merchantCode}
        totalSize={totalSize}
        currentPage={pageNumber}
        setCurrentPage={setPageNumber}
        rowsPerPage={pageSize}
        setRowsPerPage={setPageSize}
        onDownload={downBatchSettlementTransaction} 
      />
    </div>
  )
}

export default SettlementBatchTransaction;