import React from 'react';
import DataTable from '@/components/Table';

const SettlementBankAccountTable = ({filteredData}) => {
    
    const columns = [
        {
            header: 'Bank Name',
            accessor: 'batchCode',
        },
        {
            header: 'Account Name',
            accessor: 'batchCode',
        },
        {
            header: 'Account Number',
            accessor: 'batchCode',
        },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (value) => (
                <span 
                    className={value === true ? 'text-priColor' : 'text-red-600'}
                >
                    {value === true ? 'True' : 'False'}
                </span>
            )
        },
    ];

    return (
        <div className="">

            <DataTable
                columns={columns}
                data={filteredData}
                rowsPerPageOptions={[5, 10, 20, 50]}
                displayActionButton={false}
                elementId='SettlementBankAccountTable'
            />
        </div>
    );
};

export default SettlementBankAccountTable;