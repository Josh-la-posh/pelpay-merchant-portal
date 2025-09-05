import { useState } from 'react';

function ApiKeyManagement() {
    const [apiKeys, setApiKeys] = useState([
        { id: 1, key: 'abcd-1234-efgh-5678', created: '2024-10-20', active: true },
        { id: 2, key: 'ijkl-9101-mnop-1123', created: '2024-08-15', active: false }
    ]);

    const generateNewKey = () => {
        const newKey = {
            id: apiKeys.length + 1,
            key: `newkey-${Math.random().toString(36).substring(2)}`,
            created: new Date().toISOString().split('T')[0],
            active: true
        };
        setApiKeys([...apiKeys, newKey]);
    };

    const revokeKey = (id) => {
        setApiKeys(apiKeys.map(key => key.id === id ? { ...key, active: false } : key));
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">API & Application Key Management</h2>
            <button 
                className="mb-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                onClick={generateNewKey}
            >
                Generate New API Key
            </button>
            <div className="space-y-4">
                {apiKeys.map(key => (
                    <div key={key.id} className="p-4 border border-gray-300 rounded-md">
                        <p><strong>Key:</strong> {key.key}</p>
                        <p><strong>Created On:</strong> {key.created}</p>
                        <p><strong>Status:</strong> {key.active ? 'Active' : 'Revoked'}</p>
                        <button
                            className="mt-2 py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            onClick={() => revokeKey(key.id)}
                            disabled={!key.active}
                        >
                            Revoke Key
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ApiKeyManagement;
