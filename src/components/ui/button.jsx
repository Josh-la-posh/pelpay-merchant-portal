import PropTypes from "prop-types";

const Button = ({ children, onClick, variant = "primary", className, type, disabled }) => {
    const baseClass = "w-full px-4 py-2 rounded-md font-semibold text-lg transition-colors duration-150 cursor-pointer";
    const variantClass =
      variant === "primary"
        ? "bg-priColor text-white hover:opacity-95"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  
    return (
      <button
        type={type}
  className={`${baseClass} ${variantClass} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
  
  Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(["primary", "secondary"]),
    className: PropTypes.any,
    type: PropTypes.string,
    disabled: PropTypes.bool
  };

export default Button;
