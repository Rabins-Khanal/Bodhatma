const express = require("express");
const router = express.Router();

router.post("/initiate", (req, res) => {
  const { amount, productId } = req.body;

  const esewaURL = `https://rc-epay.esewa.com.np/api/epay/main/v2/form`;

  // Dummy values for sandbox testing
  const payload = {
    amt: amount,
    psc: 0,
    pdc: 0,
    txAmt: 0,
    tAmt: amount,
    pid: productId || "TEST1234",
    scd: "EPAYTEST",
    su: "https://localhost:3000/payment/success",
    fu: "https://localhost:3000/payment/failure",

  };

  const formFields = Object.entries(payload)
    .map(
      ([key, value]) =>
        `<input type="hidden" name="${key}" value="${value}"/>`
    )
    .join("");

  const htmlForm = `
    <html>
      <body onload="document.forms[0].submit()">
        <form action="${esewaURL}" method="POST">
          ${formFields}
        </form>
      </body>
    </html>
  `;

  res.send(htmlForm);
});

module.exports = router;
