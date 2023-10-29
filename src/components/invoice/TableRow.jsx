/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useInvoiceContext } from "../../hooks/useInvoiceContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import API_URL from "../../api/server";

const TableRow = ({ invoice }) => {
  const { dispatch } = useInvoiceContext();
const { user } = useAuthContext();
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${API_URL}invoices`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SET_INVOICE", payload: data });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchInvoices();
    }
  }, [dispatch, user]);

  return (
    <tr key={invoice._id}>
      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        <span>{invoice._id}</span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {invoice.client.company}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {invoice.date}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {invoice.totalamount}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {invoice.status}
      </td>
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-x-6">
          <button className="text-gray-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none">
            Delete
          </button>
          <button className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none">
            Download
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
