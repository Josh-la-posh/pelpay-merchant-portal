import React, { useState, useEffect } from 'react'
import { ArrowDownWideNarrow, ArrowLeft, CalendarDays, Cloud, Search } from 'lucide-react';
// import { ReactComponent as MastercardIcon } from '@/assets/Mastercard.svg';
// import { ReactComponent as StanbicIcon } from '@/assets/Stanbic.svg';
// import { ReactComponent as VerveIcon } from '@/assets/verve.svg';
// import { ReactComponent as WemaIcon } from '@/assets/wema.svg';
// import { ReactComponent as VisaIcon } from '@/assets/Visa.svg';
// import { ReactComponent as AfrigoIcon } from '@/assets/Afrigo.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import TransactionService from '@/services/api/transactionApi';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAuth from '@/services/hooks/useAuth';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

function TransactionFilter({filteredData, setFilteredData, transactions, handleRefresh, setFilteredDataResult}) {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchMode, setSearchMode] = useState('All');
    const [searchFilterType, setSearchFilterType] = useState('TransactionId');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const transactionService = new TransactionService(axiosPrivate);
    const [canSearch, setCanSearch] = useState(false);
    const env = 'None';
    const pageNumber = 1;
    const [formData, setFormData] = useState({
        transactionReference : '',
        accountNumber : '',
        sessionId : '',
        sDate : '',
        eDate : '',
        status : '',
        customerEmail : '',
    });

    const handleRefreshAllTransctions = () => {
        setSearchMode('All');
        handleRefresh();
    }

    useEffect(() => {
        setFilterStatus('All');
        setSearchMode('All');
    }, []);

    const handleFilter = () => {
        setCanSearch(false);
        if (searchMode === 'Date') {
            setSearch('');
            const filteredTransactions = transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.modifiedDate);
                const isAfterStartDate = startDate ? transactionDate >= new Date(startDate) : true;
                const isBeforeEndDate = endDate ? transactionDate <= new Date(endDate) : true;
                return isAfterStartDate && isBeforeEndDate;
            });
            setFilteredData(filteredTransactions);
            filterByDate();
            // setFilteredDataResult(filteredTransactions);
        } else {
            setStartDate(null);
            setEndDate(null);
            filterByPaymentReference();
        }
    };

    useEffect(() => {
        if (searchMode === 'All') {
            setCanSearch(false);
            setFilteredData(transactions);
        }
    }, [searchMode])

    useEffect(() => {
        setCanSearch(false);
        setEndDate(null);
        setStartDate(null);
        const filteredTransactions = transactions.filter((row) => {
            const rowValues = Object.values(row).map(val => (val || '').toString().toLowerCase());
            const matchSearch = search
                ? rowValues.some(val => val.includes(search.toLowerCase()))
                : true;

            return matchSearch;
        });
        setFilteredData(filteredTransactions);
    }, [transactions, search]);

    useEffect(() => {
        setCanSearch(false);
        const filteredTransactions = filteredData.filter((row) => {
            const matchFilter = filterStatus !== 'All' 
                ? row.transactionStatus === filterStatus 
                : true;

            return matchFilter;
        });
        setFilteredDataResult(filteredTransactions);
    }, [filterStatus, filteredData]);

    const handleFilteredDataChange = (val) => {
        setCanSearch(false);
        setFilterStatus(val);
    }

    const handleSearchMode = (e) => {
        setCanSearch(false);
        setSearchFilterType(e.target.value);
    }

    const handleFilterSearch = (e) => {
        setSearch(e.target.value);
    };

    const filterByDate = async () => {
        const merchantCode = auth?.merchant?.merchantCode;
        if (startDate === null) {
            toast('Select a start data to continue');
            return;
        };
        if (endDate === null) {
            toast('Select a end data to proceed');
            return;
        };
        await transactionService.fetchtransactionsByDate(merchantCode, startDate, endDate, pageNumber, 40, env, dispatch);
    };

    const filterByPaymentReference = async () => {
        const paymentReference = search;
        const merchantCode = auth?.merchant?.merchantCode;
        await transactionService.fetchtransactionsByPaymentReference(merchantCode, paymentReference, env, dispatch);
    };

    const downloadTransaction = async () => {
        const merchantCode = auth?.merchant?.merchantCode;
        await transactionService.downloadTransactionReceipt(
            merchantCode,
            pageNumber,
            40,
            env,
            startDate,
            endDate,
            filterStatus,
            formData.sessionId,
            formData.accountNumber,
            formData.transactionReference,
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const searchByData = async () => {
        const merchantCode = auth?.merchant?.merchantCode;
        
        setFormData((prev) => ({
            ...prev,
            sDate: startDate ?? '',
            eDate: endDate ?? ''
        }));
        await transactionService.searchTransaction(merchantCode, 1, 40, env, formData, dispatch);
    };
    
  return (
    <div className='mb-4'>
        {/* <div className="w-full flex flex-col md:flex-row items-center space-y-3">
        </div> */}
        <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className='text-priColor flex items-center gap-2 text-xs'><ArrowLeft size={'14px'}/> Go Back</button>
            <div className="flex gap-1 sm:gap-2">
                <button onClick={handleRefreshAllTransctions}
                    className={`${searchMode === 'All' ? 'text-white bg-priColor font-[600]' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 py-2 px-2 rounded-sm`}>
                        All
                </button>
                {
                    searchMode !== 'Date' && 
                    <button onClick={() => setSearchMode('Date')}
                        className={`${searchMode === 'Date' ? 'text-white bg-priColor font-[600]' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 py-2 px-2 rounded-sm flex justify-between items-center gap-2`}>
                            <CalendarDays size='14' />
                            Date
                    </button>
                }
                { searchMode !== 'Filter' &&
                    <button onClick={() => setSearchMode('Filter')}
                        className={`${searchMode === 'Filter' ? 'text-white bg-priColor' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 py-2 px-2 rounded-sm flex justify-between items-center`}>
                            <ArrowDownWideNarrow size='14' />
                            Filter
                    </button>
                }                
            </div>
        </div>
        
        <div className="flex justify-end mt-4 gap-2">
            { searchMode === 'Filter' &&
                <div className ="ml-5 flex items-center justify-center gap-2">
                    <select id="searchFilterType" value={searchFilterType} onChange={handleSearchMode} className="p-2 border focus:outline-none rounded-sm bg-white text-gray-400 selection:bg-transparent text-xs">
                        <option value="Name">Name</option>
                        <option value="Email">Email</option>
                        <option value="paymentReference">Transaction ID</option>
                    </select>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={handleFilterSearch}
                            className="p-2 pl-8 border border-gray-300 rounded-sm focus:outline-none text-xs"
                            placeholder="Search transactions..."
                        />
                        <Search
                            size='14'
                            className='absolute left-2 top-2/4 transform -translate-y-2/4 text-gray-400' />
                    </div>
                    <button onClick={handleFilter}
                        className='text-white bg-priColor text-xs w-20 py-2 px-2 rounded-sm flex justify-center items-center'>
                            Filter
                    </button>
                </div>
            }
            {
                searchMode === 'Date' &&
                <div className="flex space-x-3 ml-5">
                    <DatePicker 
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText='Start Date'
                        className='text-gray-400 border border-gray-300 bg-white text-xs w-20 py-2 px-2 rounded-sm flex justify-between items-center'
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText='End Date'
                        className='text-gray-400 border border-gray-300 bg-white text-xs w-20 py-2 px-2 rounded-sm flex justify-between items-center'
                    />
                    <button onClick={handleFilter}
                        className='text-white bg-priColor text-xs w-20 py-2 px-2 rounded-sm flex justify-center items-center'>
                            Search
                    </button>
                    
                </div>
            }
        </div>
        
        <div className="flex justify-end mt-4">
            { canSearch &&
                <div className ="flex flex-col items-center justify-center gap-5">
                    <div className="grid grid-cols-6 gap-2">
                        <input
                            type="text"
                            name='transactionReference'
                            value={formData.transactionReference}
                            onChange={handleChange}
                            className="col-span-2 lg:col-span-1 p-2 md:pl-4 border border-gray-300 rounded-lg focus:outline-none text-xs"
                            placeholder="Transaction Reference"
                        />
                        <input
                            type="text"
                            name='accountNumber'
                            value={formData.accountNumber}
                            onChange={handleChange}
                            className="col-span-2 lg:col-span-1 p-2 md:pl-4 border border-gray-300 rounded-lg focus:outline-none text-xs"
                            placeholder="Account Number"
                        />
                        <input
                            type="text"
                            name='sessionId'
                            value={formData.sessionId}
                            onChange={handleChange}
                            className="col-span-2 lg:col-span-1 p-2 md:pl-4 border border-gray-300 rounded-lg focus:outline-none text-xs"
                            placeholder="Session ID"
                        />
                        <div className="col-span-3 md:col-span-2 xl:col-span-1">
                            <DatePicker 
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText='Start Date'
                                className='text-gray-400 border border-gray-300 bg-white text-xs w-40 py-2 px-2 rounded-lg flex justify-between items-center'
                            />
                        </div>
                        <div className="col-span-3 md:col-span-2 xl:col-span-1">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText='End Date'
                                className='text-gray-400 border border-gray-300 bg-white text-xs w-40 py-2 px-2 rounded-lg flex justify-between items-center'
                            />
                        </div>                        
                        <select
                            id="status" 
                            name='status' 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="col-span-6 md:col-span-2 xl:col-span-1 p-2 text-xs text-gray-400 border focus:outline-none rounded-lg bg-white selection:bg-transparent">
                            <option value="Successful">Successful</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Otp">Otp</option>
                            <option value="AuthSetup">Auth Setup</option>
                            <option value="Secure3D">Secure3D</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                    <div className="flex gap-5">
                        <button
                            className='text-white border border-gray-300 bg-priColor text-xs font-[600] py-2 px-2 rounded-sm flex justify-between items-center gap-2'
                            onClick={searchByData}
                            >
                                Search
                        </button>
                        <button
                            className={`text-priColor border border-priColor text-xs font-[600] py-2 px-2 rounded-sm flex justify-between items-center gap-2`}
                            onClick={() => setCanSearch(false)}
                            >
                                Cancel
                        </button>

                    </div>
                </div>
            }
            {
                canSearch === false &&
                <button
                    onClick={() => setCanSearch(true)}
                    className={`text-white border border-gray-300 bg-priColor text-xs font-[600] py-2 px-2 rounded-sm flex justify-between items-center gap-2`}
                    >
                        <Search size='14' />
                        Search
                </button>
            }
        </div>
        <div className="h-20 sm:h-32 bg-[#F0F2F5] my-4 p-4">
            <div className="bg-white h-full flex justify-center items-center gap-5">
                <div className="flex-1">
                    <img src='/assets/Visa.svg' alt='Visa'/>
                </div>
                <div className="flex-1">
                    <img src='/assets/Afrigo.svg' alt='Afrigo'/>
                </div>
                <div className="flex-1">
                    <img src='/assets/Mastercard.svg' alt='Master Card'/>
                </div>
                <div className="flex-1">
                    <img src='/assets/Stanbic.svg' alt='Stanbic'/>
                </div>
                <div className="flex-1">
                    <img src='/assets/verve.svg' alt='Verve'/>
                </div>
                <div className="flex-1">
                    <img src='/assets/wema.svg' alt='Wema'/>
                </div>
            </div>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-end sm:items-center sm:justify-between">
            <div className="flex gap-1 sm:gap-2 py-2">
                <button onClick={() => handleFilteredDataChange('All')}
                    className={`${filterStatus === 'All' ? 'text-white bg-priColor' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 sm:w-24 py-2 rounded-sm`}>
                        All
                </button>
                <button onClick={() => handleFilteredDataChange('Successful')}
                    className={`${filterStatus === 'Successful' ? 'text-white bg-priColor' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 sm:w-24 py-2 rounded-sm`}>
                        Successful
                </button>
                <button onClick={() => handleFilteredDataChange('Pending')}
                    className={`${filterStatus === 'Pending' ? 'text-white bg-priColor' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 sm:w-24 py-2 rounded-sm`}>
                        Pending
                </button>
                <button onClick={() => handleFilteredDataChange('Failed')}
                    className={`${filterStatus === 'Failed' ? 'text-white bg-priColor' : 'text-gray-400 border border-gray-300 bg-white'} text-xs w-20 sm:w-24 py-2 rounded-sm`}>
                        Failed
                </button>
            </div>
            <button onClick={downloadTransaction} className='text-priColor text-xs rounded-md flex items-center justify-center gap-2 hover:bg-priColor/56 p-3 hover:text-[#121212]'><Cloud size={'15px'}/> Download</button>
        </div>
    </div>
  )
}

export default TransactionFilter