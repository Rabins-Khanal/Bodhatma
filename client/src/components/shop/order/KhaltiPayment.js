import React, { useEffect } from 'react';

const KhaltiPayment = ({ amount, onSuccess, onError, onClose }) => {
  useEffect(() => {
    // Load Khalti script
    const script = document.createElement('script');
    script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const config = {
        publicKey: 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
        productIdentity: 'Order Payment',
        productName: 'Buddha Store Order',
        productUrl: window.location.origin,
        eventHandler: {
          onSuccess: (payload) => {
            console.log('Payment successful:', payload);
            onSuccess(payload);
          },
          onError: (error) => {
            console.log('Payment error:', error);
            onError(error);
          },
          onClose: () => {
            console.log('Payment window closed');
            onClose();
          }
        },
        paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
      };

      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: amount * 100 }); // Khalti expects amount in paisa
    };

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [amount, onSuccess, onError, onClose]);

  return null; // This component doesn't render anything visible
};

export default KhaltiPayment; 