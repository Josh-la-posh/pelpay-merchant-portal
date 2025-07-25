import React, { useEffect, useState } from 'react'
import CustomModal from '@/components/Modal'
import UpdateInputField from '@/components/UpdateInputField';
import useAuth from '@/services/hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import Spinner from '../../../../../components/Spinner';

function PaymentForm({selectedIntegrationKey, accessToken, setIsModalOpen}) {
    const { auth } = useAuth();
    const uniqueId = crypto.randomUUID();
    const [openPopupWithIframe, setOpenPopupWithIframe] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '100',
        currency: 'NGN',
        merchantRef: uniqueId,
        narration: 'test',
        callBackUrl: 'https://your_callback_url.com',
        splitCode: '',
        shouldTokenizeCard: false,
        customer: {
            customerId: 'csg',
            customerLastName: 'Chams',
            customerFirstName: 'Switch',
            customerEmail: 'chams@chamsswitch.com',
            customerPhoneNumber: '',
            customerAddress: '',
            customerCity: '',
            customerStateCode: '',
            customerPostalCode: '',
            customerCountryCode: 'NG'
        },
        integrationKey: selectedIntegrationKey,
        notificationUrl: 'https://your_notification_url.com/',
        mcc: '0',
        merchantDescriptor: 'string',
        channels: ["Card", "BankTransfer", "USSD"]

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

    const openIframePopup = () => {
        setOpenPopupWithIframe(true);
    };

    const closeIframePopup = () => {
        setOpenPopupWithIframe(false);
    };

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
        setRedirectUrl(data.paymentUrl);
        setIsLoading(false);
        setOpenPopupWithIframe(true);

        // window.open(data.paymentUrl, '_blank');
        // window.location.href = data.paymentUrl;
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
                <UpdateInputField 
                    label='Currency'
                    type='text'
                    id='currency'
                    valueName={formData.currency}
                    onChange={handleChange}
                    disabled={true}
                />
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

            {openPopupWithIframe && (
                <div style={styles.overlay}>
                    <div style={styles.popup}>
                        <button style={styles.closeButton} onClick={closeIframePopup}>
                            <X />
                        </button>

                        <iframe
                        src={redirectUrl}
                        title="Glass"
                        style={styles.iframe}
                        ></iframe>
                    </div>
                </div>
            )}
        </CustomModal>)
    )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    position: "relative",
    background: "#fff",
    borderRadius: "5px",
    width: "90%",
    maxWidth: "800px",
    height: "80%",
    display: "flex",
    flexDirection: "column",
  },
  iframe: {
    flex: 1,
    border: "none",
    borderRadius: "5px",
  },
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    color: 'gray',
    border: "none",
    cursor: "pointer",
  },
};

export default PaymentForm;