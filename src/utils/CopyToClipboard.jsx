import { useState } from 'react';
import PropTypes from 'prop-types';

const CopyToClipboardField = ({ text, value, successMessage = "Copied to clipboard!", className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <div className='relative'>
      <button
        onClick={handleCopy}
        value={value}
        className={className}
      >{text}</button>
      {copied && <p className='absolute bottom-[-15px] left-2 text-green-800 text-[9px]'>{successMessage}</p>}
    </div>
  );
};

export default CopyToClipboardField;

CopyToClipboardField.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  successMessage: PropTypes.string,
  className: PropTypes.string,
};
