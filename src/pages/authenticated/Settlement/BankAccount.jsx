import React, { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import SettlementBankAccountTable from './components/SettlementBankAccountTable';
import { useDispatch, useSelector } from 'react-redux';

function SettlementBankAccount() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { settlement } = useSelector(state => state.settlement);
  const { auth } = useAuth();
  const merchantCode = auth?.merchantCode;

  useEffect(() => {
      setAppTitle('Settlement Bank Account');
  }, []);
  return (
    <div>
      <SettlementBankAccountTable filteredData={settlement} />
    </div>
  )
}

export default SettlementBankAccount;