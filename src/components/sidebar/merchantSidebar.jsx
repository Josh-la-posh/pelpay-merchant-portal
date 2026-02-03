import { Link } from 'react-router-dom';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import { Boxes, File, User } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

const MerchantSidebar = () => {
    const { settingsTitle } = useSettingsTitle();

    const [sidebarItems] = useState([
        {
            id: 1,
            icon: <User size={'15px'} />,
            name: 'Profile',
            url: '/merchants/profile',
            title: 'Profile'
        },
        // {
        //     id: 2,
        //     icon: <UserPlus size={'15px'} />,
        //     name: 'Add Merchant',
        //     url: '/merchants/addNew',
        //     title: 'New'
        // },
        {
            id: 3,
            icon: <Boxes size={'15px'} />,
            name: 'Aggregator',
            url: '/merchants/aggregator',
            title: 'Aggregator'
        },
        // {
        //     id: 4,
        //     icon: <Paperclip size={'15px'} />,
        //     name: 'Document',
        //     url: '/merchants/document',
        //     title: 'Document'
        // },
        {
            id: 5,
            icon: <File size={'15px'} />,
            name: 'Credential',
            url: '/merchants/credential',
            title: 'Credential'
        },
    ]);

     const [permissions, setPermissions] = useState({
        canAdd: "",
      });
    

      useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("RolePermission"));
      const UserRolePermission = stored?.responseData || [];
      const merchantPerm = UserRolePermission.find(
        (item) => item?.permission?.permissionName?.trim()?.toLowerCase() === "merchant"
      );
      // console.log("Merchant role", merchantPerm)
      // const aggregatorPerm = UserRolePermission.find(
      //   (item) => item?.permission?.permissionName?.trim()?.toLowerCase() === "aggregator"
      // );
      // console.log("get aggregator permission", aggregatorPerm)
      if (merchantPerm) {
        setPermissions({
          canAdd: merchantPerm?.canAdd,
        });
      }
    } catch (err) {
      console.error("Error parsing RolePermission from localStorage:", err);
    }
  }, []);

  
  const filteredMerchantSidebar = useMemo(() => {
    return sidebarItems.filter(item => {
      if (item.name === 'Add Merchant' && !permissions.canAdd) {
        return false; 
      }
      // if (item.name === 'Aggregator' && !permissions.canAdd) {
      //   return false; 
      // }
      return true;
    });
  }, [sidebarItems, permissions]);

    return (
        <div className="">
            <div className="text-gray-800 text-sm md:text-lg mb-4">
                {settingsTitle}
            </div>
            <nav className={`bg-white sm:pt-4 flex-1 flex items-center sm:block overflow-y-auto scrollbar-none`}>
                {
                    // sidebarItems.map((item) => (
                    filteredMerchantSidebar.map((item) => (
                        <Link key={item.id} to={item.url} className={`block px-3 sm:px-0 py-2 sm:py-4 ${settingsTitle === item.title ? 'text-priColor sm:border-r-4 border-priColor transition duration-300 bg-priColor/10' : ''}`}>
                            <div className={`flex items-center gap-2 sm:pl-4`}>
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

export default MerchantSidebar;