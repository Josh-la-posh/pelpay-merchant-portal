import { Link } from 'react-router-dom';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import { BookUser, GroupIcon, LockOpen, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const SettingsSidebar = () => {
    const { settingsTitle } = useSettingsTitle();

    const [sidebarItems, setSidebarItems] = useState([
        {
            id: 1,
            icon: <User size={'15px'} />,
            name: 'Profile',
            url: '/settings/profile',
            title: 'Accounts'
        },
        {
            id: 2,
            icon: <BookUser size={'15px'} />,
            name: 'Contact',
            url: '/settings/contact',
            title: 'Contact'
        },
        // {
        //     id: 3,
        //     icon: <LockKeyhole size={'15px'} />,
        //     name: 'Security',
        //     url: '/settings/security',
        //     title: 'Security'
        // },
        // {
        //     id: 4,
        //     icon: <Bell size={'15px'} />,
        //     name: 'Notification',
        //     url: '/settings/notification',
        //     title: 'Notification'
        // },
        // {
        //     id: 5,
        //     icon: <Verified size={'15px'} />,
        //     name: 'Privacy',
        //     url: '/settings/privacy',
        //     title: 'Privacy'
        // },
        {
            id: 5,
            icon: <GroupIcon size={'15px'} />,
            name: 'Teams',
            url: '/settings/user',
            title: 'Teams'
        },
        {
            id: 6,
            icon: <LockOpen size={'15px'} />,
            name: 'Roles',
            url: '/settings/role',
            title: 'Roles'
        },
    ])

    useEffect(() => {
    try {
        const stored = JSON.parse(localStorage.getItem('auth'));
        const userRoles = stored?.data?.roles || [];
        const roleName = userRoles.some(
        (role) => role.roleName === 'SuperAdmin'
        );

      if (!roleName) {
        setSidebarItems((prev) =>
          prev.filter((item) => item.name !== 'Teams' && item.name !== 'Roles')
        );
      }
    } catch (error) {
      console.log('Failed to parse roles from localStorage', error);
    }
  }, []);

    return (
        <div className="">
            <div className="text-gray-800 text-md md:text-lg mb-4">
                {settingsTitle}
            </div>
            <nav className={`bg-white sm:pt-4 flex-1 flex sm:block overflow-y-auto scrollbar-none`}>
                {
                    sidebarItems.map((item) => (
                        <Link key={item.id} to={item.url} className={`block px-3 sm:px-0 py-2 sm:py-4 ${settingsTitle === item.title ? 'text-priColor sm:border-r-4 border-priColor transition duration-300 bg-priColor/10' : ''}`}>
                            <div className={`flex items-center gap-2 pl-4`}>
                                {item.icon}
                                <div>{item.name}</div>
                            </div>
                        </Link>
                    ))
                }
            </nav>
        </div>
    );
};

export default SettingsSidebar;