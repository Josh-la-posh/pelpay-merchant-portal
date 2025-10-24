// React import removed: using automatic JSX runtime
import MerchantProfileContent from '../../Merchant/components/merchantProfile/MerchantProfileContent';
import PropTypes from 'prop-types';

function AggregatorProfile({ aggregatorData = {} }) {
    const data = Array.isArray(aggregatorData) ? aggregatorData[0] || {} : aggregatorData || {};
    return (
     <div className='bg-white p-5 grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm gap-4'>
            <MerchantProfileContent
                title='Aggregator Name'
                value={data.aggregatorName ?? 'N/A'}
            />
        <MerchantProfileContent
            title='Aggregator Code'
            value={data.aggregatorCode ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Status'
            value={data.status ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Address'
            value={`${data.address ?? 'N/A'}, ${data.city ?? 'N/A'}`}
        />
        <MerchantProfileContent
            title='Country'
            value={data.countryCode ?? 'N/A'}
        />
        <MerchantProfileContent
            title='State'
            value={data.stateCode ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Business Type'
            value={data.businessType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Business Description'
            value={data.businessDescription?? 'N/A'}
        />
        <MerchantProfileContent
            title='Registration Type'
            value={data.registrationType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Charge Type'
            value={data.chargeType ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Website'
            value={data.website ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Approved'
            value={data.isApproved === true ? 'True' : data.isApproved === false ? 'False' : 'N/A'}
        />
        <MerchantProfileContent
            title='Contact Email'
            value={data.contactEmail ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Support Email'
            value={data.supportEmail ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Dispute Email'
            value={data.disputeEmail ?? 'N/A'}
        />
        <MerchantProfileContent
            title='Business Email'
            value={data.businessEmail ?? 'N/A'}
        />
    </div>
  )
}

export default AggregatorProfile;

AggregatorProfile.propTypes = {
    aggregatorData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};