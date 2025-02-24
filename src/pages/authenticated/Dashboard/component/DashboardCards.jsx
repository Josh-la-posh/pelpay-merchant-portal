import Card from '@/components/Card';
import { Check, CircleDollarSign, ShoppingCart, Smile } from 'lucide-react';

function DashboardCards({ lumpsum }) {
    const totalRevenue = lumpsum && Array.isArray(lumpsum)
      ? lumpsum.filter(data => data.transactionStatus === 'Successful')
        .reduce((sum, data) => sum + data.transactionVolume, 0)
      : 0;

      const totalCounts = lumpsum && Array.isArray(lumpsum)
      ? lumpsum.reduce((sum, t) => sum + t.transactionCount, 0)
      : 0;

      const successfulTransaction = lumpsum && Array.isArray(lumpsum)
      ? lumpsum.find(item => item.transactionStatus === "Successful")?.transactionCount
      : 0;

      const failedTransaction = lumpsum && Array.isArray(lumpsum)
      ? lumpsum.find(item => item.transactionStatus === "Failed")?.transactionCount
      : 0;

  return (
    <div className="grid grid-cols-3 md:grid-cols-1 gap-4 lg:gap-0 mb-8 md:mb-0">
      <Card title="Total Revenue" value={`₦${totalRevenue}`} icon={<CircleDollarSign size='15px' className='text-[#7447C6]' />} />
      <Card title="Total Transactions" value={totalCounts} color="bg-red-700" color2= "bg-[#0000FF]" icon={<ShoppingCart size='15px' className='text-[#FFC107]' />} />
      <Card title="Successful Payments" value={successfulTransaction} color="bg-[#E7F6EC]" color2="bg-priColor" icon={<Check size='15px' className='text-[#40B869]' />} />
      <div className="hidden md:flex items-center pt-4">
        <div className='flex item-start gap-2'>
          <div className="w-6 h-6">
            <Smile color='#00A049' size='20' />
          </div>
          <div className=''>
            <h3 className='font-[700] text-gray-600 text-sm mb-1'>You're doing good!</h3>
            {/* <p className='text-[11px] text-gray-400 '>Your performance is 12% better compare to last year</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCards