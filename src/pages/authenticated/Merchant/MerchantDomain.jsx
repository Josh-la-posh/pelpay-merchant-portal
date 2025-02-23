import React, { useEffect, useState } from 'react'
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
  const merchantService = new MerchantService(axiosPrivate);
  const dispatch = useDispatch();
  const { merchantDomain } = useSelector((state) => state.merchant);
  const [filteredData, setFilteredData] = useState(merchantDomain);

  useEffect(() => {
      setAppTitle('Merchant Domain');
  }, []);

  useEffect(() => {
    const loadData = async () => {
        await merchantService.fetchMerchantDomain(merchantCode, dispatch);
    };
    loadData();
  }, [merchantCode, dispatch]);

  return (
    <div>
      {/* <MerchantDomainFilter /> */}
      <MerchantDomainTable filteredData={merchantDomain} />
    </div>
  )
}

export default MerchantDomain;