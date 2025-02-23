import React from 'react';
import DataTable from '@/components/Table';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettlementTable = ({filteredData}) => {
    
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
    return (
        <div className="">

            <DataTable
                columns={columns}
                data={filteredData}
                rowsPerPageOptions={[5, 10, 20, 50]}
                displayActionButton={false}
                elementId='SettlementTable'
            />
        </div>
    );
};

export default SettlementTable;