import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../services/hooks/useTitle';
import { ArrowLeftRight, Handshake, LayoutDashboard, LogOut, Settings, Warehouse, X, ShieldCheck  } from 'lucide-react';
// import Logo from "../assets/logo.jpg";
import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Sidebar = ({ handleSidebar, isSidebarTextVisible = true }) => {
    const [sidebarItems, setSideBarItems] = useState([
         {
            id: 1,
            icon: <ShieldCheck size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Compliance',
            url: '/compliance',
            openSidebar: true
        },
        {
            id: 2,
            icon: <LayoutDashboard size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Dashboard',
            url: '/',
            openSidebar: true
        },
        {
            id: 3,
            icon: <Warehouse size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Merchant',
            url: '/merchants/profile',
            openSidebar: false
        },
        {
            id: 4,
            icon: <Handshake size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Settlements',
            url: '/settlement/all',
            openSidebar: true
        },
        {
            id: 5,
            icon: <ArrowLeftRight size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Transaction',
            url: '/transactions',
            openSidebar: true
        },
        {
            id: 6,
            icon: <Settings size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Settings',
            url: '/settings/profile',
            openSidebar: false
        },
        // {
        //     id: 7,
        //     icon: <Headset size={isSidebarTextVisible ? '18' : '22'} />,
        //     title: 'Help Center',
        //     url: '/help-center',
        //     openSidebar: true
        // },
    ])

    const { appTitle } = useTitle();
    const { complianceData, step } = useSelector((state) => state.compliance || {});

    useEffect(() => {
        // console.log("Compliance Step Updated:", step);
        if (step === 6) {
            setSideBarItems((prevItems) =>
                prevItems.filter((item) => item.title !== 'Compliance')
            );
        }
    }, [complianceData, step]);

    return (
        <div className="relative h-[100vh] flex flex-col text-sm lg:text-[14px] bg-white shadow-lg pb-2">
            <button
                className="sm:hidden border-2 border-priColor rounded-full p-1 absolute right-[-15px] top-3"
                onClick={() => handleSidebar(false)}
            >
                <X />
            </button>
            <div className='bg-[#f7f7f7] w-full h-16 flex items-center'>
                <img src='/assets/logo.jpg' alt="Logo" className="max-h-fit max-w-[85%]" />
            </div>
            <nav className={`flex-1 my-2 ${isSidebarTextVisible ? 'pl-6' : ''} overflow-y-auto scrollbar-none`}>
                {
                    sidebarItems.map((item) => (
                        <Link key={item.id} to={item.url} onClick={() => handleSidebar(false)} className={`block py-4 ${appTitle === item.title ? 'text-priColor' : ''}`}>
                            <div className={`flex items-center ${isSidebarTextVisible ? '' : 'justify-center'} gap-2`}>
                                <button
                                    data-tooltip-id={`tooltip-${item.id}`}
                                    type='button'
                                    className='relative'
                                >
                                    {item.icon}
                                </button>
                                {!isSidebarTextVisible && <Tooltip
                                    id={`tooltip-${item.id}`}
                                    place='right'
                                    effect='solid'
                                    aria-haspopup='true'
                                >
                                    {item.title}
                                </Tooltip>}
                                
                                <div className={isSidebarTextVisible ? 'block' : 'hidden'}>{item.title}</div>
                            </div>
                        </Link>
                    ))
                }
            </nav>
            <nav className={`flex-shrink-0 ${isSidebarTextVisible ? 'pl-6' : ''}`}>
                <Link to="/login" className="block py-2 hover:bg-priColor">
                    <div className={`flex items-center ${isSidebarTextVisible ? '' : 'justify-center'} gap-2`}>
                        <LogOut size={isSidebarTextVisible ? '18' : '22'} />
                            <div className={isSidebarTextVisible ? 'block' : 'hidden'}>Logout</div>
                    </div>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    handleSidebar: PropTypes.func.isRequired,
    isSidebarTextVisible: PropTypes.bool,
};