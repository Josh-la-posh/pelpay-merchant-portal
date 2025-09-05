import { useEffect, useState } from 'react'
import useTitle from '@/services/hooks/useTitle';
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import CustomerService from '@/services/api/customerApi';
import CustomerTable from './components/CustomerTable';
import CustomerForm from './components/CustomerForm';
import { Plus } from 'lucide-react';

function CustomersPage() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const merchantCode = auth?.merchant.merchantCode;
  const customerService = new CustomerService(axiosPrivate, auth);
  const pageNumber = 1;
  const pageSize = 40;

  useEffect(() => {
      setAppTitle('Customers');
  }, []);

  const handleAddOpenModal = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (val, name) => {
    setModalMode(name);
    setSelectedCustomerData(val);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerData(null);
  };

  useEffect(() => {
    const loadData = async () => {
      if (merchantCode) {
        await customerService.fetchAllCustomer(merchantCode, pageNumber, pageSize, dispatch);
      }
    };
    loadData();
  }, [merchantCode, pageNumber, pageSize, dispatch]);

  return (
    <div className='min-h-screen bg-white border border-[#E4E7EC] rounded-lg p-8 sm:p-4 md:p-8'>
      <div className="flex flex-row items-start md:items-center gap-4">
          <button onClick={handleAddOpenModal} className='flex flex-1 sm:flex-[unset] items-center justify-center rounded-[8px] gap-[10px] px-[12px] py-[8px] text-white text-[12px] sm:text-sm font-[600] bg-priColor'>
              <Plus size='15px' />
              <span>Add</span>
          </button>
          {isModalOpen &&
              (<CustomerForm
                  handleOpenModal={handleCloseModal}
                  selectedCustomerData={modalMode === 'add' ? null : selectedCustomerData}
                  title={modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : 'View'}
                  merchantCode={merchantCode}
              />
          )}
      </div>

      {/* <CustomerCards /> */}

      {/* <div className="mt-12">
          <div className="">
              <div className="mb-4 lg:mb-0">
                  <h3 className="text-[16px] md:text-[20px] font-[600] text-[#101928]">Add Customers</h3>
                  <p className="text-xs sm:text-sm font-[400] text-[#475367]">Add Customers to your database</p>
              </div>
          </div>
      </div> */}

      <CustomerTable handleOpenModal={handleEditOpenModal} customerData={customer.customers} />


    </div>
  )
}

export default CustomersPage;