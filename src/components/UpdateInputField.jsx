import React from 'react'
import '../pages/unauthenticated/auth.css';

function UpdateInputField({ label, type, valueName, id, onChange, icon, disabled }) {
    return (
        <div className="mb-6">
            <label className="block text-xs md:text-sm text-gray-700" htmlFor={id}>
                {label}
            </label>
            <div className={`relative mt-2 w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-1 border border-gray-300 rounded-sm`}>
                <div className="absolute top-2 left-3">
                    {icon}
                </div>
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={valueName}
                    onChange={onChange}
                    disabled={disabled}
                    className="bg-transparent text-xs text-gray-900 focus:outline-none w-full"
                />
            </div>
        </div>
    )
}

export default UpdateInputField;