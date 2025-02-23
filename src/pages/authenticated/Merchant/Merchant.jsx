import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import AggregatorService from '@/services/api/aggregatorApi';
import MerchantTable from './components/merchant/MerchantTable';
import MerchantFilter from './components/merchant/MerchantFilter';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';

function MerchantPage() {
  const { setAppTitle } = useTitle();
  const { setSettingsTitle } = useSettingsTitle();
  const axiosPrivate = useAxiosPrivate();
  const aggregatorService = new AggregatorService(axiosPrivate);
  const dispatch = useDispatch();
  const { aggregatorMerchants } = useSelector((state) => state.aggregator);
  const [filteredData, setFilteredData] = useState(aggregatorMerchants);

  useEffect(() => {
    setFilteredData(aggregatorMerchants);
  }, [aggregatorMerchants]);

  useEffect(() => {
      setAppTitle('Merchant');
      setSettingsTitle('Merchant');
  }, []);

  useEffect(() => {
    const loadData = async () => {
        await aggregatorService.fetchAggregatorMerchants(dispatch);
    };
    loadData();
  }, [dispatch]);

  const handleFilteredData = (newData) => {
    setFilteredData(newData);
  }

  return (
    <div className='bg-white py-4'>
      <MerchantFilter handleFilteredData={handleFilteredData} />
      <MerchantTable filteredData={filteredData} />
    </div>
  )
}

export default MerchantPage;