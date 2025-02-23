import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ columns, data, rowsPerPageOptions, onIndexChange, actionButton, selectedIndex, displayActionButton, drpp, elementId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0] || 10);

    const handleActionClick = (index) => {
        onIndexChange(index);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="">
            <div className="overflow-x-auto scrollbar-none" id={elementId}>
                <table className="min-w-full rounded-lg divide-y-8">
                    <thead className="bg-[#F0F2F5]">
                        <tr>
                            {columns.map((column, colIndex) => (
                                <th
                                    key={colIndex}
                                    className="px-6 py-3 text-left text-[9px] md:text-[9.2px] font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                            {displayActionButton && <th className="px-6 py-3 text-left text-[9px] md:text-[11px] font-medium text-gray-500 uppercase tracking-wider"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y-8">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (displayActionButton ? 1 : 0)} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-xs lg:text-[12px] text-gray-500 bg-white">
                                            {column.render
                                                ? column.render(row[column.accessor], row)
                                                : typeof row[column.accessor] === 'string' && row[column.accessor].length > 17
                                                    ? `${row[column.accessor].slice(0, 17)}...`
                                                    : row[column.accessor]}
                                        </td>
                                    ))}
                                    {displayActionButton && (
                                        <td className="relative px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => handleActionClick(rowIndex)}>
                                                <span className="text-gray-500 hover:text-gray-700">⋮</span>
                                            </button>
                                            {rowIndex === selectedIndex && actionButton}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {drpp !== '' && (
                <div className="flex flex-col sm:flex-row sm:justify-between md:items-center mt-4 ml-3 gap-4">
                    <div className="text-[12px] lg:text-[13px] text-gray-500">
                        <span className="mr-2">Items per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="bg-white border border-gray-300 rounded-lg p-2 text-gray-700"
                        >
                            {rowsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-2 py-1 lg:px-3 lg:py-2 text-xs md:text-sm text-gray-500 rounded-lg ${currentPage === 1 ? 'text-gray-300' : 'hover:border-blue-700 hover:text-black'}`}
                        >
                            &lt;
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`text-xs md:text-xs px-2 py-1 lg:px-3 lg:py-2 ml-2 rounded-[5px] ${currentPage === index + 1 ? 'border border-priColor text-black' : 'bg-white text-gray-600'} hover:bg-priColor hover:text-white`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 lg:px-3 lg:py-2 text-xs md:text-sm text-gray-500 rounded-lg ml-2 ${currentPage === totalPages ? 'text-gray-300' : 'hover:border-blue-700 hover:text-black'}`}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string.isRequired,
        render: PropTypes.func,
    })).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default DataTable;