import { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';

function SettlementConfiguration() {
  const { setAppTitle } = useTitle();

  useEffect(() => {
      setAppTitle('Settlement Configuration');
  }, []);
  return (
    <div>Settlement Configuration Page</div>
  )
}

export default SettlementConfiguration;