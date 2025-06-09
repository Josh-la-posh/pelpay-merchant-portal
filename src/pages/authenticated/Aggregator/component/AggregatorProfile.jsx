import React from 'react'
import MerchantProfileContent from '../../Merchant/components/merchantProfile/MerchantProfileContent';

function AggregatorProfile({aggregatorData}) {
  return (
    <div className='bg-white p-5 grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm gap-4'>
        <MerchantProfileContent
            title='Aggregator Name'
            value={aggregatorData.aggregatorName ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Aggregator Code'
            value={aggregatorData.aggregatorCode ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Status'
            value={aggregatorData.status ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Registration Type'
            value={aggregatorData.registrationType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Address'
            value={aggregatorData.registrationType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Country'
            value={aggregatorData.countryCode ?? 'N/A'}
        />
        <MerchantProfileContent
            title='State'
            value={aggregatorData.stateCode ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Business Type'
            value={aggregatorData.businessType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Business Description'
            value={aggregatorData.registrationType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Charge Type'
            value={aggregatorData.chargeType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Approved'
            value={aggregatorData.isApproved === true ? 'True' : 'False' ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Contact Email'
            value={aggregatorData.contactEmail ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Support Email'
            value={aggregatorData.supportEmail ?? 'N/A'}
        />
        {/* <div className="font-[500]">
            Dispute Email: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.disputeEmail ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Business Email: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.businessEmail ?? 'N/A'}
            </span>
        </div> */}
        {/* <div className="font-[500]">
            Website: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.website ?? 'N/A'}
            </span>
        </div> */}
    </div>
  )
}

export default AggregatorProfile;