import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({ label, checked, onChange, id }) => {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-primary cursor-pointer"
      />
      <span className="text-primary font-[700]">{label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default Checkbox;