import React, { Fragment, useState, useContext } from "react";
import { OrderContext } from "./index";
import UpdateOrderModal from "./UpdateOrderModal";
import SearchFilter from "./SearchFilter";
import { filterOrder } from "./Actions";

const OrderMenu = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const [dropdown, setDropdown] = useState(false);

  return (
    <Fragment>
      <div className="col-span-1 flex items-center">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 w-full">
          {/* It's open the add order modal */}
          <div
            style={{ background: "#FA8256" }}
            className="relative rounded-full text-black text-sm font-semibold uppercase"
          >
            <div
              onClick={() => setDropdown(!dropdown)}
              className="flex items-center cursor-pointer rounded-full overflow-hidden p-2 justify-center"
            >
              <svg
                className="w-6 h-6 text-black mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <span className="pr-2">Filter</span>
            </div>

            <div
              style={{ background: "#FA8256" }}
              className={`${
                dropdown ? "" : "hidden"
              } absolute top-0 left-0 mt-12 rounded-lg overflow-hidden w-full md:w-48 flex flex-col z-10`}
            >
              {["All", "Not processed", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <span
                  key={status}
                  onClick={() =>
                    filterOrder(status, data, dispatch, dropdown, setDropdown)
                  }
                  className="px-4 py-2 hover:bg-[#e76e42] text-center cursor-pointer"
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SearchFilter />
          </div>
        </div>

        {/* Update order modal */}
        <UpdateOrderModal />
      </div>
    </Fragment>
  );
};

export default OrderMenu;
