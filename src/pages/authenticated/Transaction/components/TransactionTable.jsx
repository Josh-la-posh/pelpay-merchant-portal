import React, { useState } from 'react';
import ExportPopup from '@/utils/exportPopup';
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import CustomModal from '@/components/Modal';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { EyeIcon } from 'lucide-react';

const TransactionTable = ({filteredData, handleOpenModal, isExportPopupOpen, setIsExportPopupOpen}) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    
    const columns = [
        {
            header: 'Date',
            accessor: 'modifiedDate',
            render: (value) => (
                <span>
                    {dateFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Time',
            accessor: 'modifiedDate',
            render: (value) => (
                <span>
                    {timeFormatter(value)}
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
    
    const handleSelectedRow = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <div className="">
            <DataTable
                columns={columns}
                data={filteredData}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onIndexChange={handleSelectedRow}
                selectedIndex={selectedIndex}
                displayActionButton={false}
                elementId='transactionTable'
            />
            <ExportPopup
                isOpen={isExportPopupOpen}
                onClose={() => setIsExportPopupOpen(false)}
                data={filteredData}
                elementId='transactionTable'
            />
        </div>
    );
};

export default TransactionTable;