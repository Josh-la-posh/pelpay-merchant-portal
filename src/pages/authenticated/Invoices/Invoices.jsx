import React, { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceService from '@/services/api/invoiceApi';
import InvoiceFilter from './components/InvoiceFilter';
import InvoiceTable from './components/InvoiceTable';

function InvoicesPage() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { invoice } = useSelector((state) => state.invoice);
  const { auth } = useAuth();
  const merchantCode = auth?.merchantCode;
  const invoiceService = new InvoiceService(axiosPrivate, auth);
  const pageNumber = 1;
  const pageSize = 40;

  useEffect(() => {
      setAppTitle('Invoices');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (merchantCode) {
        await invoiceService.fetchInvoices(merchantCode, pageNumber, pageSize, dispatch);
      }
    };
    loadData();
  }, [merchantCode, pageNumber, pageSize, dispatch]);

  return (
    <div className='space-y-4'>
      <InvoiceFilter />
      <InvoiceTable filteredData={invoice} />
    </div>
  )
}

export default InvoicesPage;