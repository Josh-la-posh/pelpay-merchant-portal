import React, { useMemo } from "react";
import { formatEncodedDate } from "../../../../utils/formatEncodedDate";
import { formatNumber } from "../../../../utils/formatNumber";

const TransactionDetails = ({ data = [], columns = []}) => {

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + Number(item.totalAmount || item.averageAmount), 0);
  }, [data]);

  return (
     <div className="overflow-x-auto mt-5">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-left border-b">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-3">{col.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-3">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
                // const value = col.accessor ? row[col.accessor] : null

                // return (
                //   <td key={colIndex} className="p-3">
                //     {col.render 
                //         ? col.render(row, value)   // Pass both row + value
                //         : value}
                //   </td>
                // );
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDetails;
