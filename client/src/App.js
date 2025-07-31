import React, { Fragment, useReducer } from "react";
import Routes from "./components";
import { LayoutContext, layoutState, layoutReducer } from "./components/shop";
import { TwoFactorProvider } from "./components/shop/auth/TwoFactorContext";

function App() {
  const [data, dispatch] = useReducer(layoutReducer, layoutState);
  return (
    <Fragment>
      <LayoutContext.Provider value={{ data, dispatch }}>
        <TwoFactorProvider>
          <Routes />
        </TwoFactorProvider>
      </LayoutContext.Provider>
    </Fragment>
  );
}

export default App;
