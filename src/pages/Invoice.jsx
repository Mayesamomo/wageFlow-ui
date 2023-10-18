import { useState, useEffect } from "react";
import { Pagination, TableHeader, TableRow } from "../components/invoice";
import { getAllInvoices } from "../api/invoiceApi";
function InvoiceTable() {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [invoices, setInvoices] = useState([]);

    // Fetch invoices when the component mounts
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getAllInvoices();
                setInvoices(data);
            } catch (error) {
                // display an error message
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <section className="container px-4 mx-auto py-4">
            <div className="flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden ">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <TableHeader />
                                <tbody className="bg-white divide-y divide-gray-200 ">
                                    {currentItems.map((invoice, index) => (
                                        <TableRow key={index} invoice={invoice} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={invoices.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </section>
    );
}

export default InvoiceTable;
