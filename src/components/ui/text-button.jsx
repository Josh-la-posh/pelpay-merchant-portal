import PropTypes from "prop-types";

const TextButton = ({ children, onClick, variant = "primary", className }) => {
    const baseClass = "font-[700] text-md";
    const variantClass =
      variant === "primary"
        ? "text-primary hover:text-primary-dark dark:hover:text-white"
        : variant === "danger"
        ? "text-danger"
        : "";
  
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