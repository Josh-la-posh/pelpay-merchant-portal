import PropTypes from "prop-types";


const MerchantProfileContent = ({ title, value }) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    return (
        <div className="flex">
            <p className='flex-1  text-sm font-medium'>{title}:</p>
            <span className='ml-0 sm:ml-4 flex-1 text-sm font-semibold  text-gray-600 break-words'>{displayValue}</span>
        </div>
    );
}

MerchantProfileContent.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.node]),
};

export default MerchantProfileContent;