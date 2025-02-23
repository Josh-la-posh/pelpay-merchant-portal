import React, { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import AggregatorService from '@/services/api/aggregatorApi';
import AggregatorProfile from './component/AggregatorProfile';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function Aggregator() {
  const { setAppTitle } = useTitle();
  const { setSettingsTitle } = useSettingsTitle();
  const axiosPrivate = useAxiosPrivate();
  const aggregatorService = new AggregatorService(axiosPrivate);
  const dispatch = useDispatch();
  const { aggregator, aggregatorLoading, aggregatorError } = useSelector((state) => state.aggregator);
  const [aggregatorData, setAggregatorData] = useState(aggregator);
  const [isLoading, setIsLoading] = useState(aggregatorLoading);
  const [errMsg, setErrMsg] = useState(aggregatorError);

  useEffect(() => {
    setAggregatorData(aggregator);
  }, [aggregator]);

  useEffect(() => {
      setAppTitle('Merchant');
      setSettingsTitle('Aggregator');
  }, []);
          
  useEffect(() => {
      setIsLoading(aggregatorLoading);
  }, [aggregatorLoading]);
          
  useEffect(() => {
      setErrMsg(aggregatorError);
  }, [aggregatorError]);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleRefresh = () => {
    loadData();
  }
  
  const loadData = async () => {
    await aggregatorService.fetchAggregator(dispatch);
  };

  if (isLoading) return (
      <div className='h-[40vh] w-full'>
          <Spinner />
      </div>
  );

  if (errMsg !== null) return (
      <div className='h-[40vh] w-full'>
          <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />
      </div>
  );
  
  return (
    <div>
      <AggregatorProfile  aggregatorData={aggregatorData}/>
    </div>
  )
}

export default Aggregator;