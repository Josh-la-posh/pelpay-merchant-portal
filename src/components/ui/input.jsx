import PropTypes from "prop-types";

const InputField = ({ label, placeholder, type = "text", id, value, onChange, required = false, textColor, inputClassName = '', labelClassName = '' }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && (
        <label className={`text-sm font-semibold ${textColor ? textColor : 'text-gray-700'} ${labelClassName}`} htmlFor={id}>
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
        required={required}
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-priColor focus:ring-2 focus:ring-priColor/20 ${textColor ? textColor : 'text-gray-700'} ${inputClassName}`}
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  required: PropTypes.bool,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  textColor: PropTypes.string,
};

export default InputField;
