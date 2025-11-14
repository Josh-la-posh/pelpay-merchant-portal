import { useEffect, useState, useCallback, useMemo } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import { useDispatch, useSelector } from 'react-redux';
import TransactionService from '@/services/api/transactionApi';
import TransactionTable from './components/TransactionTable';
import TransactionFilter from './components/TransactionFilter';
import TransactionForm from './components/TransactionForm';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';
import { setTransactionPageNumber, setTransactionPageSize } from '../../../redux/slices/transactionSlice';

function TransactionPage() {
  const { auth } = useAuth();
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { transactions, transactionPageNumber, transactionPageSize, transactionTotalSize, transactionLoading, transactionError } = useSelector((state) => state.transaction);
  const [isLoading, setIsLoading] = useState(transactionLoading);
  const [errMsg, setErrMsg] = useState(transactionError);
  const merchantCode = auth?.merchant.merchantCode;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState({});
  const transactionService = useMemo(() => new TransactionService(axiosPrivate, auth), [axiosPrivate, auth]);
  const [pageNumber, setPageNumber] = useState(transactionPageNumber);
  const [pageSize, setPageSize] = useState(transactionPageSize);
  const [totalSize, setTotalSize] = useState(transactionTotalSize);
  const [currentFilters, setCurrentFilters] = useState({});
  // const env = 'Test';
  const env = useSelector((state) => state.env.env);

  useEffect(() => {
    setAppTitle('Transaction');
  }, [setAppTitle]);
            
  useEffect(() => {
    setIsLoading(transactionLoading);
  }, [transactionLoading]);
      
  useEffect(() => { setErrMsg(transactionError); }, [transactionError]);
        
    useEffect(() => {
      setPageNumber(transactionPageNumber);
    }, [transactionPageNumber]);
        
    useEffect(() => {
      setPageSize(transactionPageSize);
    }, [transactionPageSize]);
        
    useEffect(() => {
      setTotalSize(transactionTotalSize);
    }, [transactionTotalSize]);

  const loadData = useCallback(async () => {
    if (merchantCode) {
      await transactionService.fetchtransactions(merchantCode, env, currentFilters, transactionPageNumber, transactionPageSize, dispatch);
    }
  }, [merchantCode, env, currentFilters, transactionPageNumber, transactionPageSize,  transactionService, dispatch]);

  useEffect(() => {
      loadData();
    }, [loadData]);

  const handleRefresh = () => { loadData(); }
  
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
      <TransactionFilter
        handleRefresh={handleRefresh}
        pageNumber={transactionPageNumber}
        pageSize={transactionPageSize}
        setCurrentFilters={setCurrentFilters}
        // setPageNumber={setPageNumber}
        setPageNumber={(page) => dispatch(setTransactionPageNumber(page))}
        currentFilters={currentFilters}
      />

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
            data={transactions}
            handleOpenModal={handleOpenModal}
            totalSize={transactionTotalSize}
            currentPage={transactionPageNumber}
            // setCurrentPage={setPageNumber}
             setCurrentPage={(page) => dispatch(setTransactionPageNumber(page))}
            rowsPerPage={transactionPageSize}
            // setRowsPerPage={setPageSize}
            setRowsPerPage={(size) => dispatch(setTransactionPageSize(size))}
          />
      }
    </div>
  )
}

export default TransactionPage;