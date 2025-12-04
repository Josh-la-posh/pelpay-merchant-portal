import PropTypes from 'prop-types';

const Card = ({ title, value, icon, color, color2, subtitle, subtitle2, text, svg }) => {


    return (
        <div className='p-4 md:p-5 md:mb-2 rounded-[8px] border bg-white h-55  border-[#E4E7EC] text-white bg-priColor/10 hover:shadow-lg  transition duration-200'>
            <div className="flex justify-between">
                
                <div>
                    <div className="pl-2 flex gap-2 items-center">
                        {color2 && <div className={`${color2} w-[15px] h-[15px] rounded-md hidden md:block`}></div>}
                        <p className="text-xs xl:text-sm text-[#667185] flex-1 pb-3">{title}</p>
                    </div>
                    <h1 className="text-[#1D2739] text-2xl font-extrabold pl-2 ">{value}</h1>
                    <div className='pl-2'>
                        <p className='text-green-500 text-xs pt-3 '>{subtitle}</p>
                        <p className='text-[#525864] text-xs  pt-2'>{subtitle2}</p>
                        <p className='text-gray-600 pt-3 text-sm font-semibold'>{text}</p>
                    </div>
                    
                </div>

                {/* <div className={`h-12 xl:h-10 w-12 xl:w-10 rounded-full border bg-green-50 p-5 flex justify-center items-center mb-3`}> */}
                    <div className="text-[#1761D9] flex justify-center items-center">{icon}</div>
                {/* </div> */}
            
            </div>

            <div >
                {svg}
            </div>
            
            
            {/* <div className='p-3 md:p-2 md:mb-2 rounded-[8px] border border-[#E4E7EC] text-white bg-priColor/10 flex flex-col justify-between'>
            <div className={`h-12 xl:h-8 w-12 xl:w-8 rounded-full border ${color || 'border-priColor'} flex justify-center items-center mb-3`}>
                <div className="text-[#1761D9] flex justify-center items-center">{icon}</div>
            </div>
            <h2 className="text-[#1D2739] text-xl font-semibold pl-2">{value}</h2>
            <div className="pl-2 flex gap-2 items-center">
                {color2 && <div className={`${color2} w-[15px] h-[15px] rounded-md hidden md:block`}></div>}
                <p className="text-xs xl:text-sm font-[500] text-[#667185] flex-1">{title}</p>
            </div>
            </div> */}
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.node,
    color: PropTypes.string,
    color2: PropTypes.string

}

export default Card;