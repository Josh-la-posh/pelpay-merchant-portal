import React from 'react'
import Card from '@/components/dashboard/Card'
import { Check, DollarSign, User } from 'lucide-react'

function CustomerCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card title="Total Customers" value='12,657' color="bg-[#E3EFFC]" icon={<User size='15px' className='text-[#7447C6]'/>} />
            <Card title="Total Volume" value='1234500' color="bg-[#EEE8FA]" icon={<DollarSign size='15px' className='text-[#7447C6]' />} />
            <Card title="Total No Active Customer" value='185' color="bg-[#E7F6EC]" icon={<Check size='15px' className='text-[#40B869]' />} />
        </div>
    )
}

export default CustomerCards;