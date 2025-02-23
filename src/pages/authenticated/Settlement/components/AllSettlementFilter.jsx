import { Link } from 'react-router-dom';

function SettlementFilter() {
    
  return (
    <div className="flex justify-end gap-4">
        <Link
            to='/settlement/bank'
            className={`text-white border border-gray bg-priColor text-xs font-[600] py-2 px-2 rounded-sm flex justify-between items-center gap-2`}
            >
                Bank Account
        </Link>
    </div>
  )
}

export default SettlementFilter;