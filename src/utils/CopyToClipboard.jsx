import React, { useState } from 'react';

const CopyToClipboardField = ({text, value, successMessage = "Copied to clipboard!", className }) => {
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
