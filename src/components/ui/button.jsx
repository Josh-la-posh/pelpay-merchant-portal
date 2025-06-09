import PropTypes from "prop-types";

const Button = ({ children, onClick, variant = "primary", className, type, disabled }) => {
    const baseClass = "w-full px-4 py-2 rounded-md font-[600] text-lg";
    const variantClass =
      variant === "primary"
        ? "bg-priColor/80 hover:bg-priColor text-white dark:text-black"
        : "bg-red-500 hover:bg-gray-600";
  
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
