import React, { Fragment, createContext } from "react";
import { Navber, Footer } from "../partials";
import { useLocation } from "react-router-dom";
import CartPage from "../partials/CartPage";

export const LayoutContext = createContext();

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <Fragment>
      <div className="flex-grow">
        <Navber />

        {location.pathname === "/cart" && (
          <div className="mt-80"> {/* Increased spacing */}
            <CartPage />
          </div>
        )}

        {children}
      </div>

      <Footer />
    </Fragment>
  );
};

export default Layout;
