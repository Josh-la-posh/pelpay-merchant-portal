import PropTypes from 'prop-types';
import ComplianceHeader from '../../../../components/ComplianceHeader';
import { useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const FormSixEmail = ({ handlePrevStep, handleNextStep, existingData }) => {
  const [supportEmail, setSupportEmail] = useState(existingData?.supportEmail || '');
  const [disputeEmail, setDisputeEmail] = useState(existingData?.disputeEmail || '');
  const [contactEmail, setContactEmail] = useState(existingData?.contactEmail || existingData?.otherEmail || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!supportEmail) errs.supportEmail = 'Support email required';
    else if (!emailRegex.test(supportEmail)) errs.supportEmail = 'Invalid email';
    if (!disputeEmail) errs.disputeEmail = 'Dispute email required';
    else if (!emailRegex.test(disputeEmail)) errs.disputeEmail = 'Invalid email';
  if (contactEmail && !emailRegex.test(contactEmail)) errs.contactEmail = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('supportEmail', supportEmail);
    formData.append('disputeEmail', disputeEmail);
  formData.append('contactEmail', contactEmail);
    formData.append('progress', 6); // new progress step
    handleNextStep(formData, false);
    setSubmitting(false);
  };

  return (
    <div className='max-w-[450px]'>
      <ComplianceHeader
        title='Business Contact Emails'
        subtitle='Provide key emails we can use to reach your business.'
      />
      <div className='mt-4 space-y-4'>
        <div>
          <label className='block text-[11px] font-medium text-gray-700 mb-1'>Support Email *</label>
          <input
            type='email'
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className={`w-full border rounded-md p-3 text-[12px] outline-none ${errors.supportEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='e.g. support@yourbusiness.com'
          />
          {errors.supportEmail && <p className='text-red-500 text-[10px] mt-1'>{errors.supportEmail}</p>}
        </div>
        <div>
          <label className='block text-[11px] font-medium text-gray-700 mb-1'>Dispute Email *</label>
          <input
            type='email'
            value={disputeEmail}
            onChange={(e) => setDisputeEmail(e.target.value)}
            className={`w-full border rounded-md p-3 text-[12px] outline-none ${errors.disputeEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='e.g. disputes@yourbusiness.com'
          />
          {errors.disputeEmail && <p className='text-red-500 text-[10px] mt-1'>{errors.disputeEmail}</p>}
        </div>
        <div>
          <label className='block text-[11px] font-medium text-gray-700 mb-1'>Contact Email (optional)</label>
          <input
            type='email'
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={`w-full border rounded-md p-3 text-[12px] outline-none ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='e.g. finance@yourbusiness.com'
          />
          {errors.contactEmail && <p className='text-red-500 text-[10px] mt-1'>{errors.contactEmail}</p>}
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 mt-6'>
        {/* <button onClick={handlePrevStep} className='bg-gray-200 w-full p-4 text-black text-[13px] rounded-md cursor-pointer'>Go back</button> */}
        <button disabled={submitting} onClick={handleSubmit} className='bg-priColor disabled:opacity-50 w-full p-4 text-white text-[13px] rounded-md cursor-pointer'>Save and continue</button>
      </div>
    </div>
  );
};

FormSixEmail.propTypes = {
  handlePrevStep: PropTypes.func,
  handleNextStep: PropTypes.func,
  existingData: PropTypes.object,
};

export default FormSixEmail;
