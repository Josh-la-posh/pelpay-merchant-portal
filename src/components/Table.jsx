import React from "react";
import PropTypes from 'prop-types';

  const DataTable = ({ data, columns, drpp, totalSize, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage }) => {

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalSize / rowsPerPage);
    
    const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages before and after currentPage

    if (totalPages <= 7) {
      // If total pages are small, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first and last pages
    pages.push(1);

    // Show dots when skipping numbers
    if (currentPage > delta + 2) {
      pages.push("...");
    }

    // Pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - (delta + 1)) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

    return (
        <>
            <div className="overflow-x-auto">
                <table className="divide-y-6 divide-white dark:divide-[#2C2C3E] min-w-full border-collapse rounded-lg">
                    <thead className="bg-gray-300 dark:bg-[#20263D]">
                        <tr>
                            <th className="px-4 py-3 text-left text-[9px] md:text-xs font-medium text-gray-500 tracking-wider">S.No</th>
                            {columns.map((column, colIndex) => (
                                <th
                                    key={colIndex}
                                    className="px-4 py-3 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y-4 divide-gray-300 dark:divider-[#20263D] border border-gray-300 dark:border-[#20263D]">
                    {
                        data?.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-200">
                                    <td className="px-4 py-3 whitespace-nowrap text-xs lg:text-sm text-gray-500">{rowIndex + 1}</td>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                                            {column.render
                                                ? column.render(row[column.accessor], row)
                                                : typeof row[column.accessor] === 'string' && row[column.accessor].length > 17
                                                    ? `${row[column.accessor].slice(0, 17)}...`
                                                    : row[column.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )
                    }
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
                            {[5, 10, 20, 40].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`cursor-pointer px-2 py-1 lg:px-3 lg:py-2 text-xs md:text-sm text-gray-500 rounded-lg ${currentPage === 1 ? 'text-gray-300' : 'hover:border-primary hover:text-primary'}`}
                        >
                            &lt;
                        </button>

                        {
                            pageNumbers.map((page, index) =>
                                page === "..." ? (
                                    <span key={index} className="px-3 py-2 text-gray-500">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(page)}
                                        className={`cursor-pointer text-xs md:text-xs px-2 py-1 lg:px-3 lg:py-2 ml-2 rounded-[5px] ${currentPage === page ? 'border border-priColor text-black dark:text-white' : 'bg-white dark:bg-transparent text-gray-600'} hover:bg-priColor hover:text-primary`}
                                    >
                                        {page}
                                    </button>
                                )
                            )
                        }
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`cursor-pointer px-2 py-1 lg:px-3 lg:py-2 text-xs md:text-sm text-gray-500 rounded-lg ml-2 ${currentPage === totalPages ? 'text-gray-300' : 'hover:border-primary hover:text-primary'}`}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}        
        </>
    )
};

export default DataTable;

DataTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string.isRequired,
        render: PropTypes.func,
    })).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};