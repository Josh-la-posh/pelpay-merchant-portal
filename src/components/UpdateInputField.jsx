import PropTypes from "prop-types";
import '../pages/unauthenticated/auth.css';
import TextButton from './ui/text-button';

function UpdateInputField({ label, type, valueName, id, onChange, icon, disabled, required=false, prefixOnclick, prefixIcon }) {
    return (
        <div className="mb-6">
            <label className="block text-xs md:text-sm text-gray-700" htmlFor={id}>
                {label}
            </label>
            <div className={`relative mt-2 w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-1 border border-gray-300 rounded-sm`}>
                <div className="absolute top-2 left-3">
                    {icon}
                </div>
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={valueName}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className="bg-transparent text-xs text-gray-900 focus:outline-none w-full"
                />
                {prefixIcon !== null && <TextButton
                    onClick={prefixOnclick}
                    variant= "custom"
                    className="absolute top-3 right-3 text-gray-500"
                    >
                    {prefixIcon}
                </TextButton>}
            </div>
        </div>
    )
}
UpdateInputField.propTypes = {
label: PropTypes.string,
type: PropTypes.string,
valueName: PropTypes.string,
id: PropTypes.string,
onChange: PropTypes.func,
icon: PropTypes.node,
disabled: PropTypes.bool,
required: PropTypes.bool,
prefixOnclick: PropTypes.func,
prefixIcon: PropTypes.node
};

export default UpdateInputField;