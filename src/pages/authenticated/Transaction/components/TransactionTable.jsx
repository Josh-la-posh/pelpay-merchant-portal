// no hooks needed
import PropTypes from 'prop-types';
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import { EyeIcon } from 'lucide-react';
import { useMemo } from 'react';

const TransactionTable = ({ data, handleOpenModal, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, drpp }) => {
    // selectedIndex removed — not used
    
    const columns = [
        {
            header: 'Date',
            accessor: 'createdDate',
             render: (value) => (
                <span>
                    {dateFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Time',
            accessor: 'createdDate',
             render: (value) => (
                <span>
                    {timeFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Transaction ID',
            accessor: 'id',
        },
        {
            header: 'Virtual Acct No',
            accessor: 'accountNumber',
            render: (value) => (
                <span className='font-medium text-gray-900'>
                    {value}
                </span>
            ),
        },
        {
            header: 'Amount (₦)',
            accessor: 'amount',
        },
        {
            header: 'Status',
            accessor: 'transactionStatus',
            render: (value) => (
                <span className={`${value === 'Successful' ? 'text-green-600' : value === 'Failed' ? 'text-red-600' : value === 'Pending' ? 'text-orange-400' : 'text-red-500'}`}>
                    {value}
                </span>
            )
        },
        {
            header: 'Action',
            accessor: 'transactionStatus',
            render: (transactionStatus, row) => (
                <span onClick={() => getDataToParent(row)}>
                    <EyeIcon color='green' />
                </span>
            )
        }
    ];
    
    const getDataToParent = (row) => {
        handleOpenModal(row);
    }

    const totalPages = useMemo(() => {
  const total = Number(totalSize);
  const rows = Number(rowsPerPage);
  return total > 0 && rows > 0 ? Math.ceil(total / rows) : 1;
}, [totalSize, rowsPerPage]);

const handlePrev = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

    // const handlePrev = () => {
    // if (currentPage > 1) {
    //   setCurrentPage(currentPage - 1);
    // }
    // }
    // const handleNext = () => {
    // const lastPage = Math.ceil(totalSize / rowsPerPage);
    // if (currentPage < lastPage) {
    //     setCurrentPage(currentPage + 1);
    // }
// };

    return (
        <div className="mt-4">
            <DataTable
                columns={columns}
                data={data}
                totalSize={totalSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                drpp={drpp}
            />
            <div className="flex justify-between mt-4 items-center">
                <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Prev
                </button>

                <span>
                Page {isNaN(currentPage) ? 1 : currentPage} of {isNaN(totalPages) ? 1 : totalPages}
                </span>

                <button
                onClick={handleNext}
                disabled={currentPage < 1 || currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Next
                </button>
            </div>
        </div>
    );
};

export default TransactionTable;

TransactionTable.propTypes = {
    data: PropTypes.array,
    handleOpenModal: PropTypes.func,
    totalSize: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    rowsPerPage: PropTypes.number,
    setRowsPerPage: PropTypes.func,
    drpp: PropTypes.any,
};