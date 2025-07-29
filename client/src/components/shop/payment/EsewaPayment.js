import React from "react";

const EsewaPayment = () => {
  const handlePay = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://uat.esewa.com.np/epay/main"; // Will only work if UAT is available

    const fields = {
      amt: 100,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: 100,
      pid: "12345678",
      scd: "EPAYTEST",
      su: "https://localhost:3000/payment/success",
      fu: "https://localhost:3000/payment/failure",
    };

    for (const key in fields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handlePay}
      >
        Pay with eSewa (Test)
      </button>
    </div>
  );
};

export default EsewaPayment;
