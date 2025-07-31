import moment from "moment";
import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const SellTable = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    todayAllOrders(dispatch);
  }, []);

  const ordersList = () => {
    if (!data?.totalOrders?.Orders) return [];
    return data.totalOrders.Orders.filter((elem) =>
      moment(elem.createdAt).isSame(moment(), "day")
    );
  };

  return (
    <Fragment>
      <div className="col-span-1 bg-white shadow-lg p-6 rounded-xl overflow-auto">
        <div className="text-2xl font-semibold mb-4 text-center text-gray-700">
           Orders ({ordersList().length})
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">Products</th>
                <th className="px-4 py-2 border text-left">Image</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Order Address</th>
                <th className="px-4 py-2 border text-left">Ordered at</th>
              </tr>
            </thead>
            <tbody>
              {ordersList().length > 0 ? (
                ordersList().map((order, index) => (
                  <TodayOrderTable key={index} order={order} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No orders 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-sm text-gray-600 mt-4 text-center">
          Total {ordersList().length} orders found
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => history.push("/admin/dashboard/orders")}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-full transition"
          >
            View All
          </button>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderTable = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Not processed":
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="p-2 border">
        {order.allProduct.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm">
            <span>{item.id.pName}</span>
            <span className="text-gray-500">({item.quantitiy}x)</span>
          </div>
        ))}
      </td>
      <td className="p-2 border">
        <div className="flex space-x-2">
          {order.allProduct.map((item, idx) => (
            <img
              key={idx}
              className="w-10 h-10 object-cover rounded"
              src={`${apiURL}/uploads/products/${item.id.pImages[0]}`}
              alt="Product"
            />
          ))}
        </div>
      </td>
      <td className="p-2 border">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${getStatusColor(order.status)}`}
        >
          {order.status}
        </span>
      </td>
      <td className="p-2 border text-sm">{order.address}</td>
      <td className="p-2 border text-sm">{moment(order.createdAt).format("lll")}</td>
    </tr>
  );
};

const TodaySell = () => {
  return (
    <div className="m-4">
      <SellTable />
    </div>
  );
};

export default TodaySell;
