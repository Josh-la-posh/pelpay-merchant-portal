// React import removed: using automatic JSX runtime
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SettlementTable = ({filteredData, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage}) => {
    
    const columns = [
        {
            header: 'Batch Code',
            accessor: 'id',
        },
        {
            header: 'Settlement Date',
            accessor: 'createdDate',
            render: (value) => (
                <span>
                    {dateFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Settlement Time',
            accessor: 'createdDate',
            render: (value) => (
                <span>
                    {timeFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Approaved',
            accessor: 'isApproved',
            render: (value) => (
                <span 
                    className={value === true ? 'text-priColor' : 'text-red-600'}
                >
                    {value === true ? 'True' : 'False'}
                </span>
            )
        },
        {
            header: 'Completed',
            accessor: 'isCompleted',
            render: (value) => (
                <span 
                    className={value === true ? 'text-priColor' : 'text-red-600'}
                >
                    {value === true ? 'True' : 'False'}
                </span>
            )
        },
        {
            header: '',
            accessor: 'id',
            render: (id) => (
                <Link to={`/settlement/batch/transaction/${id}`}>
                    <Edit size={14} color='green'/>
                </Link>
            )
        },
    ];

const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  const handleNext = () => {
  const lastPage = Math.ceil(totalSize / rowsPerPage);
  if (currentPage < lastPage) {
    setCurrentPage(currentPage + 1);
  }
};
    return (
        <div className="">
            <DataTable
                columns={columns}
                data={filteredData}
                totalSize={totalSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
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
                Page {currentPage} of {Math.ceil(totalSize / rowsPerPage)}
                </span>

                <button
                onClick={handleNext}
                disabled={currentPage === Math.ceil(totalSize / rowsPerPage)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Next
                </button>
            </div>
        </div>
    );
};

export default SettlementTable;

SettlementTable.propTypes = {
    filteredData: PropTypes.array,
    totalSize: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    rowsPerPage: PropTypes.number,
    setRowsPerPage: PropTypes.func,
};