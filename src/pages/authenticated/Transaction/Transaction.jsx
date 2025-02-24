import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import TransactionService from '@/services/api/transactionApi';
import TransactionTable from './components/TransactionTable';
import TransactionFilter from './components/TransactionFilter';
import TransactionForm from './components/TransactionForm';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function TransactionPage() {
  const { auth } = useAuth();
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { transactions, transactionPageNumber, transactionPageSize, transactionTotalSize, transactionLoading, transactionError } = useSelector((state) => state.transaction);
  const [filteredData, setFilteredData] = useState(transactions);
  const [isLoading, setIsLoading] = useState(transactionLoading);
  const [errMsg, setErrMsg] = useState(transactionError);
  const [filteredDataResult, setFilteredDataResult] = useState(filteredData);
  const merchantCode = auth?.merchant.merchantCode;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState({});
  const transactionService = new TransactionService(axiosPrivate, auth);
  const [pageNumber, setPageNumber] = useState(transactionPageNumber);
  const [pageSize, setPageSize] = useState(transactionPageSize);
  const [totalSize, setTotalSize] = useState(transactionTotalSize);
  const env = 'Test';

  useEffect(() => {
      setAppTitle('Transaction');
  }, []);
            
  useEffect(() => {
    setIsLoading(transactionLoading);
  }, [transactionLoading]);
      
  useEffect(() => {
      setErrMsg(transactionError);
  }, [transactionError]);
        
    useEffect(() => {
      setPageNumber(transactionPageNumber);
    }, [transactionPageNumber]);
        
    useEffect(() => {
      setPageSize(transactionPageSize);
    }, [transactionPageSize]);
        
    useEffect(() => {
      setTotalSize(transactionTotalSize);
    }, [transactionTotalSize]);

  useEffect(() => {
    loadData();
  }, [merchantCode, env, pageNumber, pageSize, dispatch]);

  const handleRefresh = () => {
      loadData();
  }
  
  const loadData = async () => {
    if (merchantCode) {
      await transactionService.fetchtransactions(merchantCode, env, pageNumber, pageSize, dispatch);
    }
  };
  const handleOpenModal = (val) => {
    setSelectedTransactionData(val);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionData(null);
  };

  if (errMsg !== null) return (
      <div className='h-[40vh] w-full'>
          <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />
      </div>
  );

  return (
    <div>
      <TransactionFilter filteredData={filteredData} setFilteredData={setFilteredData} transactions={transactions} filteredDataResult={filteredDataResult} handleRefresh={handleRefresh} setFilteredDataResult={setFilteredDataResult}/>

      {isModalOpen && 
        (<TransactionForm
            handleCloseModal={handleCloseModal}
            data={selectedTransactionData}
        />
      )}

      {
        isLoading
        ? <div className='h-[40vh] w-full'>
            <Spinner />
        </div>
        : <TransactionTable
            filteredData={filteredDataResult}
            handleOpenModal={handleOpenModal}
            totalSize={totalSize}
            currentPage={pageNumber}
            setCurrentPage={setPageNumber}
            rowsPerPage={pageSize}
            setRowsPerPage={setPageSize}
          />
      }
    </div>
  )
}

export default TransactionPage;