import React from "react";
import { Categories, DashboardAdmin, Orders, Products } from "./admin";
import About from "./shop/home/About";

import {
  AdminProtectedRoute,
  CartProtectedRoute,
  CheckoutPage,
  Home,
  PageNotFound,
  ProductByCategory,
  ProductDetails,
  ProtectedRoute,
  WishList,
} from "./shop";

import { SettingUser, UserOrders, UserProfile } from "./shop/dashboardUser";

import ActivityPage from "./admin/activity/ActivityPage";

// Inside router setup

import Login from "./shop/auth/Login";
import Signup from "./shop/auth/Signup";
import OTPVerification from "./shop/auth/OTPVerification";
import TwoFactorDemo from "./shop/auth/TwoFactorDemo";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Scriptures from "./shop/scriptures/scriptures";
import Accessories from "./shop/product/product";

const Routes = (props) => {
  return (
    <Router>
      <Switch>
        {/* Auth Routes */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/verify-otp" component={OTPVerification} />
        <Route exact path="/2fa-demo" component={TwoFactorDemo} />

        {/* Shop & Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/wish-list" component={WishList} />
        <Route exact path="/products/:id" component={ProductDetails} />
        <Route exact path="/scriptures" component={Scriptures} />
        <Route exact path="/accessories" component={Accessories} />
        <Route exact path="/about" component={About} />
       
        
        <Route
          exact
          path="/products/category/:catId"
          component={ProductByCategory}
        />
        <CartProtectedRoute
          exact={true}
          path="/checkout"
          component={CheckoutPage}
        />

        {/* Admin Routes */}
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard"
          component={DashboardAdmin}
        />
        <AdminProtectedRoute
  exact={true}
  path="/admin/dashboard/scriptures"
  component={ActivityPage}
/>

        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/categories"
          component={Categories}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/products"
          component={Products}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/orders"
          component={Orders}
        />

        {/* User Dashboard */}
        <ProtectedRoute
          exact={true}
          path="/user/profile"
          component={UserProfile}
        />
        <ProtectedRoute
          exact={true}
          path="/user/orders"
          component={UserOrders}
        />
        <ProtectedRoute
          exact={true}
          path="/user/setting"
          component={SettingUser}
        />

        {/* 404 Page */}
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
