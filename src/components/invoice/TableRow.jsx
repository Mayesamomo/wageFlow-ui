/* eslint-disable react/prop-types */


const TableRow = ({invoice}) => {
  return (
    <tr>
            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <span>{invoice.number}</span>
            </td>
            <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {invoice.client.company}
            </td>
            <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {invoice.date}
            </td>
            <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {invoice.total}
            </td>
            <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {invoice.status}
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-x-6">
                    <button className="text-gray-500 transition-colors duration-200   hover:text-indigo-500 focus:outline-none">
                        Delete
                    </button>
                    <button className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none">
                        Download
                    </button>
                </div>
            </td>
        </tr>
  )
}

export default TableRow