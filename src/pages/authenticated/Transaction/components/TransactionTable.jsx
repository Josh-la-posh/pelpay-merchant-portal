import React, { useState } from 'react';
import ExportPopup from '@/utils/exportPopup';
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import CustomModal from '@/components/Modal';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { EyeIcon } from 'lucide-react';

const TransactionTable = ({filteredData, handleOpenModal, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, drpp}) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    
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
        <div className="">
            <DataTable
                columns={columns}
                data={filteredData}
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