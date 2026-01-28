import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Cloud, Search, Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
// import { ReactComponent as MastercardIcon } from '@/assets/Mastercard.svg';
// import { ReactComponent as StanbicIcon } from '@/assets/Stanbic.svg';
// import { ReactComponent as VerveIcon } from '@/assets/verve.svg';
// import { ReactComponent as WemaIcon } from '@/assets/wema.svg';
// import { ReactComponent as VisaIcon } from '@/assets/Visa.svg';
// import { ReactComponent as AfrigoIcon } from '@/assets/Afrigo.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import TransactionService from '@/services/api/transactionApi';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import useAuth from '@/services/hooks/useAuth';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// import { dateFormatter } from '../../../../utils/dateFormatter';
import { formatEncodedDate } from '../../../../utils/formatEncodedDate';

function TransactionFilter({ handleRefresh = () => {}, pageNumber, pageSize, setCurrentFilters, currentFilters, setPageNumber }) {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchFilterType, setSearchFilterType] = useState('TransactionId');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const transactionService = new TransactionService(axiosPrivate, auth);
    const [showAdvanced, setShowAdvanced] = useState(false); // desktop inline (md+)
    const [showDrawer, setShowDrawer] = useState(false); // mobile drawer (< md)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounceRef = useRef(null);
    // const env = 'None';
    const env = useSelector((state) => state.env.env);
    const [filters, setFilters] = useState(currentFilters || {});

    const handleRefreshAllTransctions = async () => {
        setFilters({});
        setFilterStatus('All');
        setSearch('');
        setStartDate(null);
        setEndDate(null);
        setCurrentFilters && setCurrentFilters({});
        setPageNumber && setPageNumber(1);
        const merchantCode = auth?.merchant?.merchantCode;
        if (merchantCode) {
            await transactionService.fetchtransactions(merchantCode, env, {}, 1,  20, dispatch);
        }

         if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        // handleRefresh();
    };

    // useEffect(() => {
    //     setFilterStatus('All');
    // }, []);

    useEffect(() => {
    if (currentFilters?.status) {
        setFilterStatus(currentFilters.status);
    } else {
        setFilterStatus('All');
    }
    }, [currentFilters]);

    const STATUS_OPTIONS = [
    { label: 'All', value: 'All' },
    { label: 'Successful', value: 'Successful' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Failed', value: 'Failed' },
];



    const handleFilter = async () => {
        setIsSubmitting(true);
        const merchantCode = auth?.merchant?.merchantCode;
    if (!merchantCode) { toast('No merchant context'); return; }
        const base = { ...filters };
        if (startDate) base.startDate = startDate;
        if (endDate) base.endDate = endDate;
        if (filterStatus !== 'All') base.status = filterStatus;
        const trimmed = search.trim();
        if (trimmed) {
            if (searchFilterType === 'paymentReference') base.paymentReference = trimmed;
            // else if (searchFilterType === 'Email') base.customeremail = trimmed;
            // else if (searchFilterType === 'Name') base.customerName = trimmed;
            else if (searchFilterType === 'TransactionId') base.transactionId = trimmed;
        }
        setFilters(base);
        setCurrentFilters && setCurrentFilters(base);
        setPageNumber && setPageNumber(1);
        await transactionService.fetchtransactions(merchantCode, env, base, 1, 20, dispatch);
        setIsSubmitting(false);
    };

    // No local filtering; server-driven

    const handleFilteredDataChange = async (val) => {
        setFilterStatus(val);
        const merchantCode = auth?.merchant?.merchantCode;
    if (!merchantCode) { toast('No merchant context'); return; }
        const next = { ...filters };
        if (val === 'All') delete next.status; else next.status = val;
        setFilters(next);
        setCurrentFilters && setCurrentFilters(next);
        setPageNumber && setPageNumber(1);
        await transactionService.fetchtransactions(merchantCode, env, next, 1, 20, dispatch);
    };

    const handleSearchFilterType = (e) => {
        setSearchFilterType(e.target.value);
    };

    const handleFilterSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            if (!value.trim()) return;
            await handleFilter();
        }, 500);
    };

    // removed doDeepSearch in unified approach

    // date and payment-reference flows now use doDeepSearch directly via handleFilter

    // const downloadTransaction = async () => {
    //     const merchantCode = auth?.merchant?.merchantCode;
    //     await transactionService.downloadTransactionReceipt(
    //         merchantCode,
    //         pageNumber || 1,
    //         pageSize || 40,
    //         env,
    //         filters.startDate,
    //         filters.endDate,
    //         filterStatus,
    //         filters.sessionId,
    //         filters.accountNumber,
    //         filters.paymentReference,
    //     );
    // };
const downloadTransaction = async () => {
  const merchantCode = auth?.merchant?.merchantCode;
  await transactionService.downloadTransactionReceipt(
    merchantCode,
    env,
  );
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const searchByData = async () => {
        await handleFilter();
        setShowDrawer(false);
    };

    // Close drawer on ESC
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setShowDrawer(false); };
        if (showDrawer) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showDrawer]);

    const AdvancedFields = () => (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                <input name='paymentReference' value={filters.paymentReference || ''} onChange={handleChange} className='text-xs border border-gray-300 rounded-sm px-2 py-2 focus:outline-none' placeholder='Payment Reference' />
                <input name='accountNumber' value={filters.accountNumber || ''} onChange={handleChange} className='text-xs border border-gray-300 rounded-sm px-2 py-2 focus:outline-none' placeholder='Account Number' />
                <input name='sessionId' value={filters.sessionId || ''} onChange={handleChange} className='text-xs border border-gray-300 rounded-sm px-2 py-2 focus:outline-none' placeholder='Session ID' />
                <input name='customerEmail' value={filters.customerEmail || ''} onChange={handleChange} className='text-xs border border-gray-300 rounded-sm px-2 py-2 focus:outline-none' placeholder='Customer Email' />
            </div>
            <div className='flex justify-end mt-3 gap-2'>
                <button onClick={searchByData} className='bg-priColor text-white text-[11px] px-3 py-2 rounded-sm hover:bg-priColor/90 flex items-center gap-1'>
                    <Search size={12} /> Search
                </button>
                <button onClick={() => { setShowAdvanced(false); setShowDrawer(false); }} className='text-[11px] px-3 py-2 rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center gap-1'>
                    <X size={12} /> Close
                </button>
            </div>
        </>
    );
    
    return (
        <div className='mb-4 space-y-3'>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 bg-white/70 backdrop-blur rounded-md border border-gray-200 p-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <div className='flex items-center gap-3'>
                        <button aria-label='Go back' onClick={() => navigate(-1)} className='text-priColor flex items-center gap-2 text-xs hover:underline'><ArrowLeft size={'14px'} /> Back</button>
                        <div className="hidden md:block w-px h-5 bg-gray-200" />
                    </div>
                    <div className="flex items-stretch gap-2 w-full sm:w-auto">
                        <select aria-label='Search filter type' id="searchFilterType" value={searchFilterType} onChange={handleSearchFilterType} className="p-2 border border-gray-300 focus:outline-none rounded-sm bg-white text-gray-600 text-xs w-32">
                            <option value="TransactionId">Txn ID</option>
                            <option value="paymentReference">Pay Ref</option>
                            {/* <option value="Email">Email</option>
                            <option value="Name">Name</option> */}
                        </select>
                        <div className="relative flex-1 min-w-[140px]">
                            <Search size='14' className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400' />
                            <input
                                aria-label='Search value'
                                type="text"
                                value={search}
                                onChange={handleFilterSearch}
                                className="pl-7 pr-7 py-2 border border-gray-300 rounded-sm focus:outline-none text-xs w-full"
                                placeholder="Search..."
                            />
                            {search && (
                                <button aria-label='Clear search' type='button' onClick={() => setSearch('')} className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar py-1 -mx-1 px-1" aria-label='Status filters'>
                        {/* {['All', 'Successful', 'Pending', 'Processing', 'Failed'].map(st => (
                            <button key={st} onClick={() => handleFilteredDataChange(st)} className={`flex-shrink-0 px-3 py-1 text-[11px] rounded-full border transition-colors ${filterStatus === st ? 'bg-priColor text-white border-priColor' : 'text-gray-600 border-gray-300 hover:bg-gray-100'}`}>{st}</button>
                        ))} */}

                        {STATUS_OPTIONS.map(({ label, value }) => (
                            <button
                                key={value}
                                onClick={() => handleFilteredDataChange(value)}
                                className={`flex-shrink-0 px-3 py-1 text-[11px] rounded-full border transition-colors
                                    ${filterStatus === value
                                        ? 'bg-priColor text-white border-priColor'
                                        : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap'>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => { const d = formatEncodedDate(date); setStartDate(d); }}
                                placeholderText='Start'
                                className='text-gray-600 border border-gray-300 bg-white text-[11px] w-24 py-1 px-2 rounded-sm'
                            />
                            <span className='text-gray-400 text-[11px] hidden sm:inline'>to</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => { const d = formatEncodedDate(date); setEndDate(d); }}
                                placeholderText='End'
                                className='text-gray-600 border border-gray-300 bg-white text-[11px] w-24 py-1 px-2 rounded-sm'
                            />
                        </div>
                        <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap'>
                            <button onClick={handleFilter} disabled={isSubmitting} className='flex items-center gap-1 bg-priColor text-white text-[11px] font-medium px-3 py-2 rounded-sm hover:bg-priColor/90 disabled:opacity-50'>
                                <Filter size={12} /> Apply
                            </button>
                            <button onClick={handleRefreshAllTransctions} type='button' className='flex items-center gap-1 text-[11px] px-3 py-2 rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-100'>
                                <RotateCcw size={12} /> Reset
                            </button>
                            {/* <button
                                type='button'
                                onClick={() => {
                                    if (window.innerWidth < 768) setShowDrawer(true); else setShowAdvanced(p => !p);
                                }}
                                className='flex items-center gap-1 text-[11px] px-3 py-2 rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-100'>
                                { (showAdvanced || showDrawer) ? <ChevronUp size={12} /> : <ChevronDown size={12} /> } Adv
                            </button> */}
                            <button onClick={downloadTransaction} className='flex items-center gap-1 text-[11px] px-3 py-2 rounded-sm border border-gray-300 text-priColor hover:bg-priColor/10'>
                                <Cloud size={12} /> Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Inline Advanced (md and up) */}
            {/* {showAdvanced && (
                <div className='hidden md:block border border-gray-200 rounded-md p-3 bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-150'>
                    <AdvancedFields />
                </div>
            )} */}

            {/* Mobile Drawer */}
            {showDrawer && (
                <div className='md:hidden'>
                    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40' onClick={() => setShowDrawer(false)} aria-label='Close filters overlay'></div>
                    <div className='fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-xl p-4 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-200'>
                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-xs font-semibold text-gray-700'>Advanced Filters</h3>
                            <button aria-label='Close drawer' onClick={() => setShowDrawer(false)} className='p-1 rounded hover:bg-gray-100'>
                                <X size={14} />
                            </button>
                        </div>
                        <AdvancedFields />
                    </div>
                </div>
            )}
        </div>
    );
}

TransactionFilter.propTypes = {
    handleRefresh: PropTypes.func,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    setCurrentFilters: PropTypes.func,
    currentFilters: PropTypes.object,
    setPageNumber: PropTypes.func,
};

export default TransactionFilter