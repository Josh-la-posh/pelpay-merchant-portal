import { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';

function HelpCenter() {
  const { setAppTitle } = useTitle();

  useEffect(() => {
      setAppTitle('Help Center');
  }, [setAppTitle]);
  return (
    <div>Help Center Page</div>
  )
}

export default HelpCenter;