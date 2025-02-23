import React from "react";
import PropTypes from "prop-types";

const InputField = ({ label, placeholder, type = "text", id, value, onChange, required = false, textColor, inputClassName, labelClassName }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && (
        <label className={`text-sm font-[600] ${textColor ? textColor : 'text-gray-700 dark:text-white'} ${labelClassName}`} htmlFor={id}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={`border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-transparent focus:border-primary ${textColor ? textColor : 'text-gray-700 dark:text-white'} placeholder:${textColor ? textColor : 'text-gray-700 dark:text-white'} ${inputClassName}`}
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default InputField;
