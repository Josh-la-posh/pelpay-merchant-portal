import PropTypes from 'prop-types';

const Card = ({ title, value, icon, subColor, color2, subtitle, subtitle2, text, svg, currentDate, previousDate }) => {


    return (
        <div className='p-3 sm:p-4 md:p-5 md:mb-2 rounded-[8px] border bg-white min-h-[180px] border-[#E4E7EC] text-white bg-priColor/10 hover:shadow-lg transition duration-200 overflow-hidden h-60 md:h-75 lg:h-60'>
            <div className="flex justify-between gap-2">
                
                <div className="flex-1 min-w-0">
                    <div className="pl-2 flex gap-2 items-center">
                        {color2 && <div className={`${color2} w-[15px] h-[15px] rounded-md hidden md:block flex-shrink-0`}></div>}
                        <p className="text-[10px] sm:text-xs xl:text-sm text-[#667185] pb-2 sm:pb-3 truncate">{title}</p>
                    </div>
                    <h1 className="text-[#1D2739] text-lg sm:text-xl md:text-2xl font-extrabold pl-2 truncate">{value}</h1>
                    
                    <div className='pl-2 mt-2'>
                        {/* Percent change subtitle */}
                        <p className={`${subColor} text-[10px] sm:text-xs flex items-center gap-1`}>
                            {subtitle}
                            {subtitle && (
                                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full border border-current text-[8px]">i</span>
                            )}
                        </p>
                        
                        {/* Date ranges below percent change */}
                        {(currentDate || previousDate) && (
                            <div className="mt-1.5 space-y-0.5">
                                {currentDate && (
                                    <p className='text-[#667185] text-[9px] sm:text-[10px]'>
                                        <span className="font-medium">Current:</span> {currentDate}
                                    </p>
                                )}
                                {previousDate && (
                                    <p className='text-[#667185] text-[9px] sm:text-[10px]'>
                                        <span className="font-medium">Previous:</span> {previousDate}
                                    </p>
                                )}
                            </div>
                        )}
                        
                        <p className='text-[#525864] text-[10px] sm:text-xs pt-1'>{subtitle2}</p>
                        <p className='text-gray-600 pt-2 text-xs sm:text-sm font-semibold truncate'>{text}</p>
                    </div>
                    
                </div>

                <div className="text-[#1761D9] flex justify-center items-center flex-shrink-0">
                    {icon}
                </div>
            
            </div>

            <div className="mt-2 overflow-hidden">
                {svg}
            </div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    subtitle2: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.node,
    subColor: PropTypes.string,
    color2: PropTypes.string,
    svg: PropTypes.node,
    text: PropTypes.string,
    currentDate: PropTypes.string,
    previousDate: PropTypes.string,
}

export default Card;