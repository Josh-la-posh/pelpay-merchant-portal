import PropTypes from 'prop-types';

const SettlementCard = ({ title, amount, newColor }) => {
    return (
        <div className='w-full p-[13px] md:px-5 md:py-3 rounded-xl shadow-lg text-[#667185] bg-white flex flex-col gap-3 justify-center'>
            <div className={`${newColor} rounded-full w-6 h-6`}></div>
            <h2 className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">{title}</h2>
            <p className="text-sm lg:text-lg font-[600] text-[#667185]">{amount}</p>        
        </div>
    );
};

SettlementCard.propTypes = {
    title: PropTypes.string,
    amount: PropTypes.string,
    newColor: PropTypes.string,
}

export default SettlementCard;