import PropTypes from "prop-types";

const TextButton = ({ children, onClick, variant = "primary", className }) => {
    const baseClass = "font-bold text-md transition-colors duration-150";
    const variantClass =
      variant === "primary"
        ? "text-priColor"
        : variant === "danger"
        ? "text-red-500"
        : "text-gray-700";
  
    return (
      <button className={`${baseClass} ${variantClass} ${className}`} onClick={onClick}>
        {children}
      </button>
    );
  };
  
  TextButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(["primary", "secondary", "danger", "custom"]),
    className: PropTypes.any
  };

export default TextButton;