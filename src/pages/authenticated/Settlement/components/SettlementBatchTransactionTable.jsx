// React import removed: using automatic JSX runtime
import DataTable from "@/components/Table";
import { dateFormatter } from "@/utils/dateFormatter";
import SettlementCard from "./SettlementCard";
import { Cloud } from 'lucide-react';

const columns = [
  {
    header: "Transaction Date",
    accessor: "createdDate",
    render: (value) => <span>{dateFormatter(value)}</span>,
  },
  {
    header: "Amount (₦)",
    accessor: "amount",
  },
  {
    header: "Transaction Fee (₦)",
    accessor: "merchantCharge",
  },
  {
    header: "Amount Payable (₦)",
    accessor: "amountCollected",
  },
  {
    header: "Payment Reference",
    accessor: "paymentReference",
  },
  {
    header: "Stamp Duty (₦)",
    accessor: "stampDuty",
  },
  {
    header: "Status",
    accessor: "transactionStatus",
    render: (value) => (
      <span
        className={`${
          value === "Successful"
            ? "text-green-600"
            : value === "Failed"
            ? "text-red-600"
            : value === "Pending"
            ? "text-orange-400"
            : "text-red-500"
        }`}
      >
        {value}
      </span>
    ),
  },
];

const SettlementBatchTransactionTable = ({
  filteredData = [],
  totalSize,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  onDownload,
}) => {
  const safeFiltered = Array.isArray(filteredData) ? filteredData : [];

  const processedData = safeFiltered.map((row) => ({
    ...row,
    amountPayable:
      Number(row?.amountCollected || 0) -
        (Number(row?.merchantCharge || 0) + Number(row?.customerCharge || 0)) ||
      0,
  }));

  const totalAmount = safeFiltered.reduce((sum, amount) => sum + Number(amount?.amount || 0),0);
  const totalFees = safeFiltered.reduce((sum, fee) => sum + Number(fee?.merchantCharge || 0), 0);
  const stampDuty = safeFiltered.reduce((sum, fee) => sum + Number(fee?.stampDuty || 0), 0);
  const amountPayable = totalAmount - (totalFees + stampDuty);

  const total = Number(totalSize);
  const rows = Number(rowsPerPage);
  const totalPages =  total > 0 && rows > 0 ? Math.ceil(total / rows) : 1;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div className="">
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-5">
        <SettlementCard
          className="flex-1"
          title="Total Amount"
          amount={`₦${totalAmount ?? "0"}`}
          newColor="bg-blue-800"
        />
        <SettlementCard
          title="Stamp Duty"
          amount={`₦${stampDuty ?? "0"}`}
          newColor="bg-red-600"
        />
        <SettlementCard
          title="Total Fees"
          amount={`₦${totalFees ?? "0"}`}
          newColor="bg-gray-500"
        />
        <SettlementCard
          title="Total Amount Payable"
          amount={`₦${amountPayable ?? "0"}`}
          newColor="bg-green-800"
        />
      </div>
      
      <div className="flex justify-end mb-2 mx-5">
          <button
              onClick={onDownload}
              className="text-priColor flex items-center gap-2 text-xs px-2 py-1 rounded-[4px]"
          >
              <Cloud size={'18px'} />
              Download
          </button>
      </div>
      <DataTable
        columns={columns}
        data={processedData}
        totalSize={totalSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        drpp="true"
      />
    </div>
  );
};

export default SettlementBatchTransactionTable;

import PropTypes from "prop-types";

SettlementBatchTransactionTable.propTypes = {
  filteredData: PropTypes.array,
  totalSize: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
};
