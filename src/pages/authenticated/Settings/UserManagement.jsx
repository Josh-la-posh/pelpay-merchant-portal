import { useEffect, useState, useMemo, useCallback } from 'react'
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import UserService from '@/services/api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import UserManagementTable from './component/UserManagementTable';
import { Plus } from 'lucide-react';
import AddUserForm from './component/AddUserForm';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';

function UserManagement() {
  const { setSettingsTitle } = useSettingsTitle();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const { aggregatorUser, aggregatorUserPageSize, aggregatorUserPageNumber, aggregatorUserTotalSize, aggregatorUserLoading, aggregatorUserError } = useSelector((state) => state.users);
  const [filteredData, setFilteredData] = useState(aggregatorUser);
  const [isLoading, setIsLoading] = useState(aggregatorUserLoading);
  const [errMsg, setErrMsg] = useState(aggregatorUserError);
  const aggregatorCode = auth?.data?.aggregator?.aggregatorCode;
  const userService = useMemo(() => new UserService(axiosPrivate, auth), [axiosPrivate, auth]);
  const [pageNumber, setPageNumber] = useState(aggregatorUserPageNumber);
  const [pageSize, setPageSize] = useState(aggregatorUserPageSize);
  const [totalSize, setTotalSize] = useState(aggregatorUserTotalSize);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSettingsTitle('Teams');
  }, []);

  useEffect(() => {
    setFilteredData(aggregatorUser);
  }, [aggregatorUser]);
            
  useEffect(() => {
    setIsLoading(aggregatorUserLoading);
  }, [aggregatorUserLoading]);
      
  useEffect(() => {
      setErrMsg(aggregatorUserError);
  }, [aggregatorUserError]);
        
  useEffect(() => {
    setPageNumber(aggregatorUserPageNumber);
  }, [aggregatorUserPageNumber]);
      
  useEffect(() => {
    setPageSize(aggregatorUserPageSize);
  }, [aggregatorUserPageSize]);
      
  useEffect(() => {
    setTotalSize(aggregatorUserTotalSize);
  }, [aggregatorUserTotalSize]);

  const loadData = useCallback(async () => {
    if (aggregatorCode) {
      await userService.fetchUserByAggregatorCode(aggregatorCode, pageNumber, pageSize, dispatch);
    }
  }, [aggregatorCode, pageNumber, pageSize, userService, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    loadData();
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  if (isLoading) return (
      <div className='h-[80vh] w-full'>
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
        <div className="bg-white p-3 flex justify-end mb-5">
            <button onClick={handleModalOpen} className='flex items-center justify-center gap-2 bg-priColor text-xs text-white py-2 px-5 rounded-sm'>
                <Plus size='16px' />
                Add User
            </button>
            {isModalOpen === true && <AddUserForm handleModalClose={handleModalClose} />}
        </div>
        <UserManagementTable
          filteredData={filteredData}
          totalSize={totalSize}
          currentPage={pageNumber}
          setCurrentPage={setPageNumber}
          rowsPerPage={pageSize}
          setRowsPerPage={setPageSize}
        />
    </div>
  )
}

export default UserManagement;