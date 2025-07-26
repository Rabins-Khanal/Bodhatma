import React, { Fragment, useEffect, useContext } from "react";
import moment from "moment";
import { fetchOrderByUser } from "./Action";
import Layout, { DashboardUserContext } from "./Layout";

const apiURL = process.env.REACT_APP_API_URL;

const TableHeader = () => {
  return (
    <thead className="bg-orange-100 text-orange-800 text-sm uppercase font-semibold">
      <tr>
        <th className="px-4 py-3 border">Products</th>
        <th className="px-4 py-3 border">Status</th>
        <th className="px-4 py-3 border">Total</th>
        <th className="px-4 py-3 border">Phone</th>
        <th className="px-4 py-3 border">Address</th>
        <th className="px-4 py-3 border">Transaction ID</th>
        <th className="px-4 py-3 border">Checkout</th>
        <th className="px-4 py-3 border">Updated</th>
      </tr>
    </thead>
  );
};

const TableBody = ({ order }) => {
  const statusColors = {
    "Not processed": "bg-red-100 text-red-600",
    "Processing": "bg-yellow-100 text-yellow-600",
    "Shipped": "bg-blue-100 text-blue-600",
    "Delivered": "bg-green-100 text-green-600",
    "Cancelled": "bg-red-200 text-red-800",
  };

  return (
    <tr className="border-b hover:bg-gray-50 text-sm">
      <td className="w-56 p-3">
        <div className="flex flex-col space-y-2">
          {order.allProduct.map((product, i) => (
            <div className="flex items-center space-x-2" key={i}>
              <img
                className="w-8 h-8 rounded object-cover"
                src={`${apiURL}/uploads/products/${product.id.pImages[0]}`}
                alt="productImage"
              />
              <span className="truncate">{product.id.pName}</span>
              <span className="text-gray-500 text-xs">{product.quantitiy}x</span>
            </div>
          ))}
        </div>
      </td>

      <td className="text-center p-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </td>

      <td className="text-center p-2 font-medium">Rs.{order.amount}.00</td>
      <td className="text-center p-2">{order.phone}</td>
      <td className="text-center p-2">{order.address}</td>
      <td className="text-center p-2 text-xs">{order.transactionId}</td>
      <td className="text-center p-2 text-xs">{moment(order.createdAt).format("lll")}</td>
      <td className="text-center p-2 text-xs">{moment(order.updatedAt).format("lll")}</td>
    </tr>
  );
};

const OrdersComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const { OrderByUser: orders } = data;

  useEffect(() => {
    fetchOrderByUser(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="w-full md:w-9/12 flex items-center justify-center py-24">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-col w-full my-4 md:my-0 md:w-9/12 md:px-8">
        <div className="border shadow-xl rounded-xl overflow-hidden">
          <div className="py-4 px-6 text-xl font-semibold bg-orange-100 text-orange-800 border-b border-orange-500">
            Order History
          </div>
          <div className="overflow-auto bg-white p-4">
            <table className="table-auto border w-full my-2 rounded-lg overflow-hidden">
              <TableHeader />
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((item, i) => (
                    <TableBody key={i} order={item} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-lg text-center font-semibold py-10 text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="text-sm text-gray-600 mt-2">
              Total {orders && orders.length} order(s) 
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const UserOrders = () => {
  return (
    <Fragment>
      <Layout children={<OrdersComponent />} />
    </Fragment>
  );
};

export default UserOrders;
