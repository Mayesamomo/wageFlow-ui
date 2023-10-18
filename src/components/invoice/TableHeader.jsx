
const tableHeaders = {
    invoiceId: 'Invoice Id',
    client: 'Client',
    date: 'Date',
    price: 'Price',
    status: 'Status',
  };
const TableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {Object.entries(tableHeaders).map(([key, title]) => (
          <th key={key} scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500">
            {title}
          </th>
        ))}
        <th scope="col" className="relative py-3.5 px-4">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  )
}

export default TableHeader
