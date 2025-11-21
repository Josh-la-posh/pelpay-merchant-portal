import React, { act, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import useAuth from '@/services/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { formatEncodedDate } from '../../../../utils/formatEncodedDate';
import { ArrowLeft, Filter, RotateCcw, Search, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import ActivityService from '../../../../services/api/activityApi';

const ActivityFilter = ({getFilters, setGetFilters,setPageNumber, searchTerm, setSearchTerm} ) => {

    const navigate = useNavigate();
    const {auth} = useAuth();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const activityService = new ActivityService(axiosPrivate, auth);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchFilterType, setSearchFilterType] = useState('');

    const [filters, setFilters] = useState(getFilters || {});
    const [isApply, setIsApply] = useState(false);
    const [search, setSearch] = useState(searchTerm || '');
    const debounceRef = useRef(null);

    const clearDebounce = () => {
    if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
    }
    };

    const handleFilter = async () => {
        clearDebounce();
        setIsApply(true);
        const merchantCode = auth?.merchant?.merchantCode;
        if (!merchantCode) {
            toast('Merchant code not found');
            return;
        }
        const apiAction = searchFilterType || "";
        const newFilters = {
            startDate: startDate || '',
            endDate: endDate || '',
            action: apiAction || '',
        };

        setFilters(newFilters);
        setGetFilters(newFilters);
        setPageNumber && setPageNumber(1);

        await activityService.fetchActivities(
            merchantCode,
            newFilters,
            1,
            20,
            dispatch
        );
        setIsApply(false);
    };


    const handleSearchFilterType = (e) => {
         clearDebounce();
        setSearchFilterType(e.target.value);
    };


    const handleFilterSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setSearchTerm(value);
        setSearchTerm && setSearchTerm(value);
        setPageNumber && setPageNumber(1);
    };


    const handleReset = async () => {
    clearDebounce();

    setStartDate(null);
    setEndDate(null);
    setSearch('');
    setSearchFilterType('');
    setSearchTerm && setSearchTerm('');

    const merchantCode = auth?.merchant?.merchantCode;
    if (!merchantCode) return;

    const newFilters = {};

    setFilters(newFilters);
    setGetFilters(newFilters);
    setPageNumber && setPageNumber(1);

    await activityService.fetchActivities(
        merchantCode,
        newFilters,
        1,
        20,
        dispatch
    );
};



  return (
    <div>
         <div className='mb-4 space-y-3'>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 bg-white/70 backdrop-blur rounded-md border border-gray-200 p-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <div className='flex items-center gap-3'>
                        <button aria-label='Go back' onClick={() => navigate(-1)} className='text-priColor flex items-center gap-2 text-xs hover:underline'><ArrowLeft size={'14px'} /> Back</button>
                        <div className="hidden md:block w-px h-5 bg-gray-200" />
                    </div>
                    <div className="flex items-stretch gap-2 w-full sm:w-auto">
                        <select
                            aria-label='Search filter type'
                            id="searchFilterType"
                            value={searchFilterType}
                            onChange={handleSearchFilterType}
                            className="p-2 border border-gray-300 focus:outline-none rounded-sm bg-white text-gray-600 text-xs w-50"
                        >
                            <option value="">Select</option>
                            <option value="LOGIN">Login</option>
                            <option value="SIGNUP">SignUp</option>
                            <option value="COMPLIANCE">Compliance</option>
                            <option value="MERCHANT">Merchant</option>
                            <option value="MERCHANT_SETTINGS">Merchant Settings</option>
                            <option value="ROLE_PERMISSION">Role Permission</option>
                            <option value="ROLE_MANAGEMENT">Role Management</option>
                            <option value="TRANSACTIONS_MANAGEMENT">Transactions Management</option>
                            <option value="SETTLEMENT_MANAGEMENT">Settlement Management</option>
                            <option value="USER_MANAGEMENT">User Management</option>
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
                                <button aria-label='Clear search' type='button' onClick={() => {setSearch(''); setSearchTerm && setSearchTerm('');}} className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
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
                            <button  onClick={handleFilter} disabled={isApply} className='flex items-center gap-1 bg-priColor text-white text-[11px] font-medium px-3 py-2 rounded-sm hover:bg-priColor/90 disabled:opacity-50'>
                                <Filter size={12} /> Apply
                            </button>

                            <button  
                                type='button'
                                onClick={handleReset}
                                className='flex items-center gap-1 text-[11px] px-3 py-2 rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-100'
                            >
                                <RotateCcw size={12} /> Reset
                            </button>

                          
                            {/* <button  className='flex items-center gap-1 text-[11px] px-3 py-2 rounded-sm border border-gray-300 text-priColor hover:bg-priColor/10'>
                                <Cloud size={12} /> Download
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default ActivityFilter
