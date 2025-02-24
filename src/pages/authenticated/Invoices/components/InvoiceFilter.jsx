import { Link } from 'react-router-dom';

function InvoiceFilter() {
    
  return (
    <div className="flex justify-end gap-4">
        <Link
            to='/disputes'
            className={`text-white border border-gray-300 bg-red-800 text-xs font-[600] py-2 px-2 rounded-sm flex justify-between items-center gap-2`}
            >
                Dispute
        </Link>
    </div>
  )
}

export default InvoiceFilter;