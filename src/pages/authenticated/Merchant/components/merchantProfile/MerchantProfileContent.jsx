import PropTypes from "prop-types";

const MerchantProfileContent = ({title, value}) => {
    return (
        <div className="flex">
            <p className='flex-1'>{title}:</p>
            <span className='font-[400] ml-0 sm:ml-4 flex-1'>{value}</span>
        </div>
    );
}

MerchantProfileContent.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string
};

export default MerchantProfileContent;