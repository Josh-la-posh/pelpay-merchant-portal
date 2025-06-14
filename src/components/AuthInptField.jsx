import PropTypes from "prop-types";
import '../pages/unauthenticated/auth.css';
import { Check, Info, X } from 'lucide-react';

function AuthInputField({ label, type, validName, valueName, id, onChange, setOnFocus, nameFocus, errNote, icon }) {
    return (
        <div className="">
            <label className="text-xs font-medium text-gray-700 flex" htmlFor={id}>
                {label}
                <span className={validName ? 'valid' : 'hide'}>
                    <Check size='15px' />
                </span>
                <span className={validName || !valueName ? 'hide' : 'invalid'}>
                    <X size='15px' />
                </span>
            </label>
            <div className={`relative mt-1 w-full ${icon ? 'gap-2' : 'gap-0'} px-3 py-2 border border-gray-300 rounded-md flex items-center`}>
                {icon && icon}
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={valueName}
                    onChange={onChange}
                    className="bg-transparent block text-xs text-gray-900 focus:outline-none w-full"
                    required
                    autoComplete='off'
                    aria-invalid={() => validName ? 'false' : 'true'}
                    aria-describedby='uidnote'
                    onFocus={() => setOnFocus(true)}
                    onBlur={() => setOnFocus(false)}
                />
            </div>
            <p id='uidnote' className={nameFocus && valueName &&
                !validName ? 'instructions' : 'offscreen'}>
                <Info size='15px' />
                &nbsp;
                {errNote}
            </p>
        </div>
    )
}
AuthInputField.propTypes = {
label: PropTypes.string,
type: PropTypes.string,
validName: PropTypes.string,
valueName: PropTypes.string,
id: PropTypes.string,
onChange: PropTypes.func,
errNote: PropTypes.string,
setOnFocus: PropTypes.func,
nameFocus: PropTypes.bool,
icon: PropTypes.node,
};

export default AuthInputField