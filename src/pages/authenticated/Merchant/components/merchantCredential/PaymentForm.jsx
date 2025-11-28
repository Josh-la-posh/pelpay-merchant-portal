import { useEffect, useState } from 'react'
import CustomModal from '@/components/Modal'
import UpdateInputField from '@/components/UpdateInputField';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../../../../../components/Spinner';

import PropTypes from 'prop-types';

function PaymentForm({ selectedIntegrationKey, accessToken, setIsModalOpen }) {
    const uniqueId = crypto.randomUUID();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        amount: "100",
        currency: "NGN",
        merchantRef: uniqueId,
        narration: "test",
        callBackUrl: typeof window !== "undefined" ? window.location.origin : "",
        splitCode: "",
        shouldTokenizeCard: false,
        customer: {
          customerId: "chams",
          customerLastName: "Switch",
          customerFirstName: "Chams",
          customerEmail: "chams@chamsswitch.com",
          customerPhoneNumber: "",
          customerAddress: "",
          customerCity: "",
          customerStateCode: "",
          customerPostalCode: "",
          customerCountryCode: "NG",
        },
        integrationKey: selectedIntegrationKey,
        notificationUrl: "https://webhook-test-sigma.vercel.app/webhook",
        mcc: "0",
        merchantDescriptor: "string",
        channels: ["Card", "BankTransfer", "USSD"],
      });
    
    useEffect(() => {
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
    try {
        setIsLoading(true);
        const response = await axios.post(
          'https://api.pelpay.ng/payment/advice',
          formData,
          { headers },
        );
        const data = response.data.responseData;
        setIsLoading(false);
        // Open payment URL in a new tab
        window.open(data.paymentUrl, '_blank');
      } catch (e) {
        setIsLoading(false);
        const errMsg = e.response.data.message;
        toast(errMsg);
      }
    }

    return (
        isLoading ? <Spinner /> : (<CustomModal handleOpenModal={handleCloseModal} width='w-[95%] md:w-[75%]'>
            <div className="mb-8">
                <div className='text-sm font-[500] pb-3 border-b border-b-gray-300'>Create Advice</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-5 md:gap-10">
                <UpdateInputField 
                    label='Amount'
                    type='number'
                    id='amount'
                    valueName={formData.amount}
                    onChange={handleChange}
                    disabled={false}
                />
                <div className="flex flex-col">
                    <label htmlFor="currency" className="text-xs font-medium mb-1">Currency</label>
                    <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-priColor"
                    >
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
                <UpdateInputField 
                    label='Merchant Reference'
                    type='text'
                    id='merchantReference'
                    valueName={formData.merchantRef}
                    onChange={handleChange}
                    disabled={false}
                />
                <UpdateInputField 
                    label='Narration'
                    type='text'
                    id='narration'
                    valueName={formData.narration}
                    onChange={handleChange}
                    disabled={false}
                />
                <UpdateInputField 
                    label='CallBack Url'
                    type='text'
                    id='callBackUrl'
                    valueName={formData.callBackUrl}
                    onChange={handleChange}
                    disabled={false}
                />
                <UpdateInputField 
                    label='Notification Url'
                    type='text'
                    id='notificationUrl'
                    valueName={formData.notificationUrl}
                    onChange={handleChange}
                    disabled={false}
                />
                <UpdateInputField 
                    label='Customer ID'
                    type='text'
                    id='customerId'
                    valueName={formData.customer.customerId}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Customer First Name'
                    type='text'
                    id='customerFirstName'
                    valueName={formData.customer.customerFirstName}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Customer Last Name'
                    type='text'
                    id='customerLastName'
                    valueName={formData.customer.customerLastName}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Customer Email'
                    type='email'
                    id='customerEmail'
                    valueName={formData.customer.customerEmail}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Customer Phone Number'
                    type='tetelt'
                    id='customerPhoneNumber'
                    valueName={formData.customer.customerPhoneNumber}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Customer Address'
                    type='text'
                    id='customerAddress'
                    valueName={formData.customer.customerAddress}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='City'
                    type='text'
                    id='customerCity'
                    valueName={formData.customer.customerCity}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='State Code'
                    type='text'
                    id='customerStateCode'
                    valueName={formData.customer.customerStateCode}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Postal Code'
                    type='text'
                    id='customerPostalCode'
                    valueName={formData.customer.customerPostalCode}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Country'
                    type='text'
                    id='customerCountry'
                    valueName={formData.customer.customerCountryCode}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Integration Key'
                    type='text'
                    id='integrationKey'
                    valueName={formData.integrationKey}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Should Tokenize Card'
                    type='text'
                    id='shouldTokenizeCard'
                    valueName={formData.shouldTokenizeCard}
                    onChange={handleChange}
                    disabled={false}
                />
                <UpdateInputField 
                    label='MCC Category'
                    type='text'
                    id='mccCategory'
                    valueName={formData.mcc}
                    onChange={handleChange}
                    disabled={true}
                />
                <UpdateInputField 
                    label='Merchant Description'
                    type='text'
                    id='merchantDescription'
                    valueName={formData.merchantDescriptor}
                    onChange={handleChange}
                    disabled={true}
                />
            </div>

            <button onClick={handleSubmit} className='py-2 px-4 bg-priColor text-white text-xs rounded-sm'>
                Submit
            </button>
        </CustomModal>)
    )
}

export default PaymentForm;

PaymentForm.propTypes = {
    selectedIntegrationKey: PropTypes.string,
    accessToken: PropTypes.string,
    setIsModalOpen: PropTypes.func,
};