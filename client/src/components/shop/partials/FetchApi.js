import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const cartListProduct = async () => {
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  if (cart.length === 0) return { Products: [] };

  try {
    const response = await fetch(`${apiURL}/api/product/cart-product`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productArray: cart.map((item) => item.id) }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return { Products: [] }; // important fallback
  }
};
