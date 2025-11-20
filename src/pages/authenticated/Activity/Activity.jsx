import React, { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import ActivityTable from "./component/ActivityTable";
import Spinner from "@/components/Spinner";
import ErrorLayout from "@/components/ErrorLayout";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { setActivityPageSize, setActivityPageNumber } from "../../../redux/slices/activitySlice";
import ActivityService from "../../../services/api/activityApi";
import ActivityFilter from "./component/ActivityFilter";

const ActivityPage = () => {
  const { auth } = useAuth();
  const { setAppTitle } = useTitle();
  const {
    activities,
    activityLoading,
    activityError,
    activityPageNumber,
    activityPageSize,
    activityTotalSize,
  } = useSelector((state) => state.activity);
  const [isLoading, setIsLoading] = useState(activityLoading);
  const [errMsg, setErrMsg] = useState(activityError);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(activityPageNumber);
  const [pageSize, setPageSize] = useState(activityPageSize);
  const [totalSize, setTotalSize] = useState(activityTotalSize);
  const [getFilters, setGetFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const merchantCode = auth?.merchant.merchantCode;

  const axiosPrivate = useAxiosPrivate();
  const activityService = useMemo(() => new ActivityService(axiosPrivate, auth), [axiosPrivate, auth]);

  useEffect(() => {
    setIsLoading(activityLoading);
  }, [activityLoading]);

  useEffect(() => {
    setErrMsg(activityError);
  }, [activityError]);

  useEffect(() => {
    setAppTitle("Activity");
  }, [setAppTitle]);

  useEffect(() => {
    setPageNumber(activityPageNumber);
  }, [activityPageNumber]);

  useEffect(() => {
    setPageSize(activityPageSize);
  }, [activityPageSize]);

  useEffect(() => {
    setTotalSize(activityTotalSize);
  }, [activityTotalSize]);

  const loadData = useCallback(async () => {
    if (merchantCode){
        await activityService.fetchActivities(merchantCode, getFilters, pageNumber, pageSize, dispatch)
    }
  }, [merchantCode, getFilters, pageNumber, pageSize, dispatch])

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => { loadData(); }

   if (errMsg !== null) return (
      <div className='h-[40vh] w-full'>
          <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />
      </div>
  );

  const filteredActivities = useMemo(() => {
    if (!searchTerm) return activities;

    const lowercasedTerm = searchTerm.toLowerCase();
    return activities.filter((activity) =>{
        // console.log("Activity Search", activity);
     return (
        activity.user?.toLowerCase().includes(lowercasedTerm) ||
        activity.id?.toString().toLowerCase().includes(lowercasedTerm) ||
        activity.action?.toLowerCase().includes(lowercasedTerm) ||
        activity.description?.toLowerCase().includes(lowercasedTerm)
      );
  });
  }, [activities, searchTerm]);

  return (
    <div>
        <ActivityFilter 
        handleRefresh={handleRefresh}
        pageNumber={pageNumber}
        pageSize={pageSize}
        setGetFilters={setGetFilters}
        getFilters={getFilters}
        setPageNumber={setPageNumber}  
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        />

      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <ActivityTable
         data={filteredActivities}
          totalSize={totalSize}
          currentPage={pageNumber}
          rowsPerPage={pageSize}
          setCurrentPage={setPageNumber}
          setRowsPerPage={setPageSize}
        //   setCurrentPage={(page) => dispatch(setActivityPageNumber(page))}
        //   setRowsPerPage={(size) => dispatch(setActivityPageSize(size))}
        />
      )}
    </div>
  );
};

export default ActivityPage;
