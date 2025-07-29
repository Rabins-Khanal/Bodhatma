import React from "react";

const PaymentFailure = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-red-600 text-3xl font-bold">❌ Payment Failed!</h1>
      <p className="mt-4">Sorry, your payment could not be processed. Please try again.</p>
    </div>
  );
};

export default PaymentFailure;
