import React, { useEffect } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';

function HelpCenter() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  useEffect(() => {
      setAppTitle('Help Center');
  }, []);
  return (
    <div>Help Center Page</div>
  )
}

export default HelpCenter;