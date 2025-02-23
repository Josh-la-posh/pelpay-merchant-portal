import React from 'react'

function AggregatorProfile({aggregatorData}) {
  return (
    <div className='bg-white p-5 grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm gap-4'>
        <div className="font-[500]">
            Aggregator Name: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.aggregatorName ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Aggregator Code: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.aggregatorCode ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Status: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.status ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Registration Type: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.registrationType ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Address: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.registrationType ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Country: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.countryCode ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            State: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.stateCode ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Business Type: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.businessType ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Business Description: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.registrationType ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Charge Type: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.chargeType ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Approved: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.isApproved === true ? 'True' : 'False' ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Contact Email: 
            <span className='ml-3 font-[400]'>
                {aggregatorData?.contactEmail ?? 'N/A'}
            </span>
        </div>
        <div className="font-[500]">
            Support Email: 
            <span className='ml-3 font-[400]'>
                {aggregatorData.supportEmail ?? 'N/A'}
            </span>
        </div>
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