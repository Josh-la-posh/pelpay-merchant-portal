import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../services/hooks/useTitle';
import { ArrowLeftRight, Handshake, Headset, LayoutDashboard, LogOut, Settings, Warehouse } from 'lucide-react';
import Logo from "../assets/logo.jpg";
import { Tooltip } from 'react-tooltip';

const Sidebar = ({handleSidebar, isSidebarTextVisible}) => {
    const { appTitle } = useTitle();
    const [tooltipVisible, setTooltipVisible] = useState(null);

    const handleMouseEnter = (id) => {
        setTooltipVisible(id); // Show tooltip on hover
    };

    const handleMouseLeave = () => {
        setTooltipVisible(null);
    };

    const sidebarItems = [
        {
            id: 1,
            icon: <LayoutDashboard size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Dashboard',
            url: '/',
            openSidebar: true
        },
        {
            id: 2,
            icon: <Warehouse size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Merchant',
            url: '/merchants/profile',
            openSidebar: false
        },
        {
            id: 3,
            icon: <Handshake size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Settlements',
            url: '/settlement/all',
            openSidebar: true
        },
        {
            id: 4,
            icon: <ArrowLeftRight size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Transaction',
            url: '/transactions',
            openSidebar: true
        },
        {
            id: 5,
            icon: <Settings size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Settings',
            url: '/settings/profile',
            openSidebar: false
        },
        {
            id: 6,
            icon: <Headset size={isSidebarTextVisible ? '18' : '22'} />,
            title: 'Help Center',
            url: '/help-center',
            openSidebar: true
        },
    ]

    return (
        <div className="relative h-[100vh] flex flex-col text-sm lg:text-[14px] bg-white shadow-lg pb-2">
            <div className='bg-[#f7f7f7] w-full h-16 flex items-center'>
                <img src={Logo} alt="Logo" className="max-h-fit max-w-[85%]" />
            </div>
            <nav className={`flex-1 my-2 ${isSidebarTextVisible ? 'pl-6' : ''} overflow-y-auto scrollbar-none`}>
                {
                    sidebarItems.map((item) => (
                        <Link key={item.id} to={item.url} onClick={() => handleSidebar(item.openSidebar)} className={`block py-4 ${appTitle === item.title ? 'text-priColor' : ''}`}>
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