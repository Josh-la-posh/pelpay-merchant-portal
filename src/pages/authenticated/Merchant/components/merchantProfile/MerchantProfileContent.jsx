import PropTypes from "prop-types";


const MerchantProfileContent = ({ title, value }) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    return (
        <div className="flex">
            <p className='flex-1'>{title}:</p>
            <span className='font-[400] ml-0 sm:ml-4 flex-1'>{displayValue}</span>
        </div>
    );
}

MerchantProfileContent.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.node]),
};

export default MerchantProfileContent;