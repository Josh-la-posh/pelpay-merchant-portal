import React from "react";
import PropTypes from "prop-types";

const Button = ({ children, onClick, variant = "primary", className }) => {
    const baseClass = "w-full px-4 py-2 rounded-xs font-[700] text-xl";
    const variantClass =
      variant === "primary"
        ? "bg-priColor/80 hover:bg-priColor dark:text-black"
        : "bg-red-500 hover:bg-gray-600";
  
    return (
      <button className={`${baseClass} ${variantClass} ${className}`} onClick={onClick}>
        {children}
      </button>
    );
  };
  
  Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(["primary", "secondary"]),
    className: PropTypes.any
  };

export default Button;
