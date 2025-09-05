// React import not needed with automatic JSX runtime

import PropTypes from 'prop-types';

const ComplianceInput = ({ label, type = 'text', value = '', onChange = () => {}, min, max, minLength, maxLength, errMsg }) => {
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

ComplianceInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  errMsg: PropTypes.string,
};

