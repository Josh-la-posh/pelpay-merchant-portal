import React, { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import DisputeService from '@/services/api/disputeApi';
import { useDispatch, useSelector } from 'react-redux';
import DisputeTable from './components/DisputeTable';

function DisputesPage() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { disputes } = useSelector((state) => state.dispute);
  const { auth } = useAuth();
  const merchantCode = auth?.merchantCode;
  const disputeService = new DisputeService(axiosPrivate, auth);
  const env = auth?.data?.merchants[0].status;
  const pageNumber = 1;
  const pageSize = 40;

  useEffect(() => {
      setAppTitle('Disputes');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (merchantCode) {
        await disputeService.fetchDisputes(
          merchantCode,
          pageNumber,
          pageSize,
          env,
          dispatch
        );
      }
    };
    loadData();
  }, [merchantCode, pageNumber, pageSize, env, dispatch]);

  return (
    <div>
      <DisputeTable filteredData={disputes}/>
    </div>
  )
}

export default DisputesPage;