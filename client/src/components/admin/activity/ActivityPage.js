import React, { useState } from "react";
import AdminNavber from "../partials/AdminNavber"; // adjust the path if needed

const ActivityPage = () => {
  const [activityData, setActivityData] = useState([
     {
      user: "Acac",
      email: "rabinskhanal65@gmail.com",
      twoFactor: "No",
      action: "Password Changed",
      date: "31/07/2025 12:15:30",
    },
    {
      user: "Acac",
      email: "rabinskhanal65@gmail.com",
      twoFactor: "No",
      action: "Logged in",
      date: "31/07/2025 08:09:17",
    },
    {
      user: "RK",
      email: "rabinskhanal47@gmail.com",
      twoFactor: "Yes",
      action: "2FA login successful",
      date: "30/07/2025 11:53:54",
    },
    {
      user: "RK",
      email: "rabinskhanal47@gmail.com",
      twoFactor: "Yes",
      action: "Entered OTP",
      date: "30/07/2025 11:53:50",
    },
    {
      user: "RK",
      email: "rabinskhanal47@gmail.com",
      twoFactor: "Yes",
      action: "Enabled 2FA",
      date: "30/07/2025 11:50:12",
    },
    {
      user: "Rabins Khanal",
      email: "sjlkhanal@gmail.com",
      twoFactor: "Yes",
      action: "Logged out",
      date: "29/07/2025 15:08:30",
    },
    {
      user: "Rabins Khanal",
      email: "sjlkhanal@gmail.com",
      twoFactor: "Yes",
      action: "Profile Edited",
      date: "29/07/2025 14:28:17",
    },
    {
      user: "Rabins Khanal",
      email: "sjlkhanal@gmail.com",
      twoFactor: "Yes",
      action: "2FA login successful",
      date: "29/07/2025 14:26:33",
    },
     {
      user: "Rabins Khanal",
      email: "sjlkhanal@gmail.com",
      twoFactor: "Yes",
      action: "Entered OTP",
      date: "29/07/2025 14:26:30",
    },
    {
      user: "Rabins Khanal",
      email: "sjlkhanal@gmail.com",
      twoFactor: "Yes",
      action: "Enabled 2FA",
      date: "29/07/2025 14:25:40",
    },
  ]);

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all activity logs?")) {
      setActivityData([]);
    }
  };

  return (
    <>
      <AdminNavber />
      <div className="p-6 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">User Activity Log</h1>
          {activityData.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Clear Logs
            </button>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-200">User</th>
                <th className="p-3 border-b border-gray-200">Email</th>
                <th className="p-3 border-b border-gray-200">2FA Enabled</th>
                <th className="p-3 border-b border-gray-200">Action</th>
                <th className="p-3 border-b border-gray-200">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {activityData.length > 0 ? (
                activityData.map((entry, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-200">{entry.user}</td>
                    <td className="p-3 border-b border-gray-200">{entry.email}</td>
                    <td className="p-3 border-b border-gray-200">{entry.twoFactor}</td>
                   <td className="p-3 border-b border-gray-200 text-gray-600 italic">
  {entry.action}
</td>


                    <td className="p-3 border-b border-gray-200">{entry.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500 border-b border-gray-200"
                  >
                    No activity logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-3 text-sm text-gray-500">
            Showing {activityData.length} of {activityData.length} (
            {activityData.length > 0 ? "1 Page" : "0 Page"})
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityPage;
