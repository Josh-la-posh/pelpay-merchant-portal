import { useEffect, useMemo } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import MerchantService from '@/services/api/merchantApi';
import MerchantDomainTable from './components/merchantDomain/MerchantDomainTable';
import { useParams } from 'react-router-dom';

function MerchantDomain() {
  const { merchantCode } = useParams();
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const merchantService = useMemo(() => new MerchantService(axiosPrivate), [axiosPrivate]);
  const dispatch = useDispatch();
  const { merchantDomain } = useSelector((state) => state.merchant);

  useEffect(() => {
      setAppTitle('Merchant Domain');
  }, [setAppTitle]);

  useEffect(() => {
    const loadData = async () => {
        await merchantService.fetchMerchantDomain(merchantCode, dispatch);
    };
    loadData();
  }, [merchantCode, dispatch, merchantService]);

  return (
    <div>
      {/* <MerchantDomainFilter /> */}
      <MerchantDomainTable filteredData={merchantDomain} />
    </div>
  )
}

export default MerchantDomain;