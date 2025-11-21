import React from 'react'
import PropTypes from 'prop-types';
import { dateFormatter, timeFormatter } from '@/utils/dateFormatter';
import DataTable from '@/components/Table';

const ActivityTable = ({data, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, drpp}) => {
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
            header: 'Id',
            accessor: 'id',
        },
        {
            header: 'User',
            accessor: 'user',
        },
        {
            header: 'Action',
            accessor: 'action',
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (value) => (
                <span className="whitespace-normal break-words">
                    {value}
                </span>
            ),
             
        }

    ];
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
                drpp="true"
            />
        </div>
  )
}

export default ActivityTable;

ActivityTable.propTypes = {
    data: PropTypes.array,
    totalSize: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    rowsPerPage: PropTypes.number,
    setRowsPerPage: PropTypes.func,
    drpp: PropTypes.any,
};