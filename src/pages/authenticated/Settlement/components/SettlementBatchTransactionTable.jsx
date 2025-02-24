import React from 'react';
import DataTable from '@/components/Table';
import { dateFormatter } from '@/utils/dateFormatter';
import SettlementCard from './SettlementCard';
    
const columns = [
    {
        header: 'Transaction Date',
        accessor: 'createdDate',
        render: (value) => (
            <span>
                {dateFormatter(value)}
            </span>
        ),
    },
    {
        header: 'Amount (₦)',
        accessor: 'amountCollected',
    },
    {
        header: 'Transaction Fee (₦)',
        accessor: 'merchantCharge',
    },
    {
        header: 'Amount Payable (₦)',
        accessor: 'amountPayable',
    },
    {
        header: 'Payment Reference',
        accessor: 'paymentReference',
    },
    {
        header: 'Stamp Duty (₦)',
        accessor: 'stampDuty',
    },
    {
        header: 'Status',
        accessor: 'transactionStatus',
        render: (value) => (
            <span 
                className={value === true ? 'text-priColor' : 'text-red-600'}
            >
                {value === true ? 'True' : 'False'}
            </span>
        )
    }
];

const SettlementBatchTransactionTable = ({filteredData, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage}) => {
    const processedData = filteredData?.map(row => ({
        ...row,
        amountPayable: `${row?.amountCollected - (row?.merchantCharge + row?.customerCharge)}`,
    }));

    const totalAmount = filteredData?.reduce((sum, amount) => (sum + amount?.amountCollected), 0)
    const totalFees = filteredData.reduce((sum, fee) => sum + fee.merchantCharge, 0);
    // const amountPayable = totalAmount - totalFees;
    const stampDuty = filteredData.reduce((sum, fee) => sum + fee.stampDuty, 0);
    const amountPayable = totalAmount - (totalFees + stampDuty);

    return (
        <div className="">
            <div className="mb-8 flex justify-around w-full space-x-12">
                <SettlementCard className='flex-1' title='Total Amount' amount={`₦${totalAmount ?? '0'}`} newColor='bg-blue-800' />
                <SettlementCard title='Stamp Duty' amount={`₦${stampDuty ?? '0'}`} newColor='bg-red-600' />
                <SettlementCard title='Total Fees' amount={`₦${totalFees ?? '0'}`} newColor='bg-gray-500' />
                <SettlementCard title='Total Amount Payable' amount={`₦${amountPayable ?? '0'}`} newColor='bg-green-800' />
            </div>
            <DataTable
                columns={columns}
                data={processedData}
                totalSize={totalSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
            />
        </div>
    );
};

export default SettlementBatchTransactionTable;