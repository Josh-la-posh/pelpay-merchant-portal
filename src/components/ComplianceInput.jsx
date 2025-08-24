import React from "react";

const ComplianceInput = ({ label, type, value, onChange, min, max, minLength, maxLength, errMsg }) => {
  return (
    <div className="mb-4">
      <label className="block text-[13px] py-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        className="block bg-gray-200  text-xs text-gray-900 w-full border border-gray-200 rounded-md p-2 "
      />
      {errMsg && <p className="text-red-500 text-xs lg:text-sm font-normal">{errMsg}</p>}
    </div>
  );
};

export default ComplianceInput;
