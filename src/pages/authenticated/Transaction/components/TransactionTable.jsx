// no hooks needed
import PropTypes from 'prop-types';
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import { EyeIcon } from 'lucide-react';

const TransactionTable = ({ data, handleOpenModal, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, drpp }) => {
    // selectedIndex removed — not used
    
    const columns = [
        {
            header: 'Date',
            accessor: '',
            render: (value, row) => (
                <span>
                    {dateFormatter(row.modifiedDate ?? row.createdDate)}
                </span>
            ),
        },
        {
            header: 'Time',
            accessor: '',
            render: (value, row) => (
                <span>
                    {timeFormatter(row.modifiedDate ?? row.createdDate)}
                </span>
            ),
        },
        {
            header: 'Transaction ID',
            accessor: 'paymentReference',
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