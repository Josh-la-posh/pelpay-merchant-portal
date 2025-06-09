import PropTypes from 'prop-types';

const Card = ({ title, value, icon, color, color2 }) => {
    return (
        <div className='p-3 md:p-2 md:mb-2 rounded-[8px] border border-[#E4E7EC] text-white bg-priColor/10 flex flex-col justify-between'>
            <div className={`h-12 xl:h-8 w-12 xl:w-8 rounded-full border ${color || 'border-priColor'} flex justify-center items-center mb-3`}>
                <div className="text-[#1761D9] flex justify-center items-center">{icon}</div>
            </div>
            <h2 className="text-[#1D2739] text-xl font-semibold pl-2">{value}</h2>
            <div className="pl-2 flex gap-2 items-center">
                {color2 && <div className={`${color2} w-[15px] h-[15px] rounded-md hidden md:block`}></div>}
                <p className="text-xs xl:text-sm font-[500] text-[#667185] flex-1">{title}</p>
            </div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.func,
    color: PropTypes.string,
    color2: PropTypes.string

}

export default Card;