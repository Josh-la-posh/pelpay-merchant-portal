import React from "react";

const ComplianceInput = ({ label, type, value, onChange, minLength, maxLength }) => {
  return (
    <div className="mb-4">
      <label className="block text-[13px] py-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        className="mb-4 block bg-gray-200  text-xs text-gray-900 w-full border border-gray-200 rounded-md p-2 "
      />
    </div>
  );
};

export default ComplianceInput;
