// Central configuration for compliance steps
import FormOne from './component/FormOne';
import FormTwo from './component/FormTwo';
import FormThree from './component/FormThree';
import FormFour from './component/FormFour';
import FormFive from './component/FormFive';
import FormSixEmail from './component/FormSixEmail';
import FormSeven from './component/FormSix';

export const COMPLIANCE_STEPS = [
  {
    key: 'business_info',
    title: 'Business Info',
    subtitle: 'Tell us about your business',
    component: FormOne,
  },
  {
    key: 'registration',
    title: 'Registration',
    subtitle: 'Official identifiers',
    component: FormTwo,
  },
  {
    key: 'documents',
    title: 'Documents',
    subtitle: 'Upload required documents',
    component: FormThree,
  },
  {
    key: 'representative',
    title: 'Representative',
    subtitle: 'Add a business representative',
    component: FormFour,
  },
  {
    key: 'owners',
    title: 'Owners',
    subtitle: 'List business owners',
    component: FormFive,
  },
  {
    key: 'contact_emails',
    title: 'Contact Emails',
    subtitle: 'Provide support & dispute emails',
    component: FormSixEmail,
  },
  {
    key: 'verification',
    title: 'Verification',
    subtitle: 'Submitting for review',
    component: FormSeven,
  },
];

export const TOTAL_STEPS = COMPLIANCE_STEPS.length;
