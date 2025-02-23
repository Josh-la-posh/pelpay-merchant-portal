import React, { useEffect, useState } from 'react';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';

function NotificationSettings() {
    const { setSettingsTitle } = useSettingsTitle();
    const [emailNotifications, setEmailNotifications] = useState({
        transactions: true,
        security: false,
        updates: true,
    });

    const [pushNotifications, setPushNotifications] = useState({
        transactions: false,
        security: true,
        updates: true,
    });

    const [smsNotifications, setSmsNotifications] = useState({
        transactions: true,
        security: true,
        updates: false,
    });

    useEffect(() => {
        setSettingsTitle('Notification');
    }, []);

    const handleEmailChange = (e) => {
        setEmailNotifications({
            ...emailNotifications,
            [e.target.name]: e.target.checked,
        });
    };

    const handlePushChange = (e) => {
        setPushNotifications({
            ...pushNotifications,
            [e.target.name]: e.target.checked,
        });
    };

    const handleSmsChange = (e) => {
        setSmsNotifications({
            ...smsNotifications,
            [e.target.name]: e.target.checked,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Notification settings saved successfully.');
        // Logic to save notification preferences can go here
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
            {/* Email Notifications */}
            <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">Email Notification</h2>
                <div className="flex flex-col space-y-4 text-sm">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="transactions"
                            checked={emailNotifications.transactions}
                            onChange={handleEmailChange}
                            className="mr-2"
                        />
                        Transaction Alerts
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="security"
                            checked={emailNotifications.security}
                            onChange={handleEmailChange}
                            className="mr-2"
                        />
                        Security Alerts
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="updates"
                            checked={emailNotifications.updates}
                            onChange={handleEmailChange}
                            className="mr-2"
                        />
                        Account Updates
                    </label>
                </div>
            </section>

            {/* Push Notifications */}
            <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">Push Notification</h2>
                <div className="flex flex-col space-y-4 text-sm">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="transactions"
                            checked={pushNotifications.transactions}
                            onChange={handlePushChange}
                            className="mr-2"
                        />
                        Transaction Alerts
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="security"
                            checked={pushNotifications.security}
                            onChange={handlePushChange}
                            className="mr-2"
                        />
                        Security Alerts
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="updates"
                            checked={pushNotifications.updates}
                            onChange={handlePushChange}
                            className="mr-2"
                        />
                        Account Updates
                    </label>
                </div>
            </section>

            {/* SMS Notifications */}
            <section className="mb-8">
            <h2 className="text-xl font-medium mb-4">SMS Notification</h2>
                <div className="flex flex-col space-y-4 text-sm">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="transactions"
                            checked={smsNotifications.transactions}
                            onChange={handleSmsChange}
                            className="mr-2"
                        />
                        Transaction Alerts
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="security"
                            checked={smsNotifications.security}
                            onChange={handleSmsChange}
                            className="mr-2"
                        />
                        Security Alerts
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="updates"
                            checked={smsNotifications.updates}
                            onChange={handleSmsChange}
                            className="mr-2"
                        />
                        Account Updates
                    </label>
                </div>
            </section>

            <div className="mb-8">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Notification Frequency</label>
                <select
                    id="frequency"
                    name="frequency"
                    className="mt-3 block py-2 px-3 border border-gray-300 rounded-md"
                >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                </select>
            </div>


            {/* Save Button */}
            <button
                onClick={handleSubmit}
                className="py-2 px-4 bg-priColor text-white text-sm rounded-md"
            >
                Save Changes
            </button>
        </div>
    );
}

export default NotificationSettings;
