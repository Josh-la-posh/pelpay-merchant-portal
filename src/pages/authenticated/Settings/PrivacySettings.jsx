import { useEffect, useState } from 'react';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import useTitle from '@/services/hooks/useTitle';

function PrivacySettings() {
    const { setSettingsTitle } = useSettingsTitle();
    const { setAppTitle } = useTitle();
    const [dataSharing, setDataSharing] = useState(false);
    const [activityVisibility, setActivityVisibility] = useState({
        transactionHistory: false,
        accountBalance: true,
    });

    const [cookies, setCookies] = useState({
        necessary: true,
        performance: false,
        marketing: false,
    });

    useEffect(() => {
        setAppTitle('Settings');
        setSettingsTitle('Privacy Settings');
    }, []);

    const handleActivityChange = (e) => {
        setActivityVisibility({
            ...activityVisibility,
            [e.target.name]: e.target.checked,
        });
    };

    const handleCookiesChange = (e) => {
        setCookies({
            ...cookies,
            [e.target.name]: e.target.checked,
        });
    };

    const handleDataSharingChange = () => {
        setDataSharing(!dataSharing);
    };

    const handleDownloadData = () => {
        // Logic to handle data download
        alert('Your data download has started.');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            // Logic to handle account deletion
            alert('Your account has been deleted.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Privacy Settings</h1>

            {/* Data Sharing Preferences */}
            <section className="mb-6">
                <h2 className="text-xl font-medium mb-4">Data Sharing Preferences</h2>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={dataSharing}
                        onChange={handleDataSharingChange}
                        className="mr-2"
                    />
                    Share my data with third-party services
                </label>
            </section>

            {/* Activity Visibility */}
            <section className="mb-6">
                <h2 className="text-xl font-medium mb-4">Activity Visibility</h2>
                <div className="flex flex-col space-y-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="transactionHistory"
                            checked={activityVisibility.transactionHistory}
                            onChange={handleActivityChange}
                            className="mr-2"
                        />
                        Hide transaction history from account overview
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="accountBalance"
                            checked={activityVisibility.accountBalance}
                            onChange={handleActivityChange}
                            className="mr-2"
                        />
                        Display account balance in overviews
                    </label>
                </div>
            </section>

            {/* Cookies Preferences */}
            <section className="mb-6">
                <h2 className="text-xl font-medium mb-4">Cookies and Tracking Preferences</h2>
                <div className="flex flex-col space-y-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="necessary"
                            checked={cookies.necessary}
                            disabled
                            className="mr-2"
                        />
                        Necessary Cookies (Required)
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="performance"
                            checked={cookies.performance}
                            onChange={handleCookiesChange}
                            className="mr-2"
                        />
                        Performance Cookies
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="marketing"
                            checked={cookies.marketing}
                            onChange={handleCookiesChange}
                            className="mr-2"
                        />
                        Marketing Cookies
                    </label>
                </div>
            </section>

            {/* Data Download */}
            <section className="mb-6">
                <h2 className="text-xl font-medium mb-4">Download My Data</h2>
                <button
                    onClick={handleDownloadData}
                    className="w-full py-2 px-4 bg-priColor text-white rounded-md"
                >
                    Download Data
                </button>
            </section>

            {/* Account Deletion */}
            <section className="mb-6">
                <h2 className="text-xl font-medium mb-4">Delete My Account</h2>
                <button
                    onClick={handleDeleteAccount}
                    className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                    Delete Account
                </button>
            </section>

            {/* Privacy Policy Link */}
            <section className="mt-8">
                <a href="/privacy-policy" className="text-priColor underline">
                    Read our Privacy Policy
                </a>
            </section>
        </div>
    );
}

export default PrivacySettings;
