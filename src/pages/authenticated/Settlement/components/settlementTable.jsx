// React import removed: using automatic JSX runtime
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Cloud } from 'lucide-react';

const SettlementTable = ({filteredData, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, onDownload,}) => {
    
    const columns = [
        {
            header: 'Batch Code',
            accessor: 'id',
        },
        {
            header: "Total Amount",
            accessor: 'totalAmount',
        },
        {
            header: "Total Fee",
            accessor: 'totalFee',
        },
        {
            header: "Amount Payable",
            accessor: 'amountPayable',
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
            header: 'View',
            accessor: 'id',
            render: (id) => (
                <Link to={`/settlement/batch/transaction/${id}`}>
                    <Edit size={14} color='green'/>
                </Link>
            )
        },
        {
            header: 'Download',
            accessor: 'id',
            render: (id) => (
                 <button
              onClick={() => onDownload(id)}
              className="text-priColor flex items-center gap-2 text-xs px-2 py-1 rounded-[4px]"
          >
              <Cloud size={'18px'} />
          </button>
            )
        },
    ];
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
                drpp="true"
            />
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