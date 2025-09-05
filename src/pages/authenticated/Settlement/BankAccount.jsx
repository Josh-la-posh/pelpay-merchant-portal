import { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';
import SettlementBankAccountTable from './components/SettlementBankAccountTable';
import { useSelector } from 'react-redux';

function SettlementBankAccount() {
  const { setAppTitle } = useTitle();
  const { settlement } = useSelector(state => state.settlement);

  useEffect(() => {
      setAppTitle('Settlement Bank Account');
  }, [setAppTitle]);
  return (
    <div>
      <SettlementBankAccountTable filteredData={settlement} />
    </div>
  )
}

export default SettlementBankAccount;