import { useEffect } from 'react';
import ChangePassword from './component/security/ChangePassword';
import AccountManagement from './component/security/AccountManagement';
import SecurityNotifications from './component/security/SecurityNotification';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import useTitle from '@/services/hooks/useTitle';

function SecuritySettings() {
    // const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const { setSettingsTitle } = useSettingsTitle();
    const { setAppTitle } = useTitle();

    // const handle2FAToggle = () => {
    //     setTwoFactorEnabled(!twoFactorEnabled);
    // };

    useEffect(() => {
        setAppTitle('Settings');
        setSettingsTitle('Security');
    }, []);

    return (
        <div className="max-w-3xl">
            {/* Change Password Section */}
            <ChangePassword />

            {/* Account Deactivation */}

            <AccountManagement />

            {/* Security Notification */}

            <SecurityNotifications />

            {/* Api Key Management */}

            {/* <ApiKeyManagement /> */}

            {/* Two-Factor Authentication Section */}

            {/* <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">Two-Factor Authentication</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Enable Two-Factor Authentication</span>
                    <button 
                        onClick={handle2FAToggle}
                        className={`py-2 px-4 rounded-md text-white ${twoFactorEnabled ? 'bg-red-500' : 'bg-green-500'}`}
                    >
                        {twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </section> */}

            {/* Login Activity Section */}
            {/* <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">Login Activity</h2>
                <div className="text-gray-700">
                    <p>Last login: Oct 23, 2024, from Chrome on Windows.</p>
                    <p>Last failed login: Oct 22, 2024, from Safari on iOS.</p>
                    <button className="mt-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md">Log out of all devices</button>
                </div>
            </section> */}
        </div>
    );
}

export default SecuritySettings;
