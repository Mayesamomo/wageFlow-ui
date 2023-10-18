/* eslint-disable react/prop-types */
import { useState } from "react"
import Modal from "react-modal"


const InvoiceTable = ({invoices}) => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const openModal = (invoice) => {
      setSelectedInvoice(invoice);
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setSelectedInvoice(null);
      setModalIsOpen(false);
    };
  
    return (
      <div>
        <table>
        <thead>
            <tr>
                <th>Client&apos;s Name</th>
                <th>Invoice ID Number</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.client.company}</td>
                <td>{invoice.number}</td>
                <td>{invoice.date}</td>
                <td>{invoice.status}</td>
                <td>
                  <button onClick={() => openModal(invoice)}>...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Invoice Actions"
        >
          <h2>Invoice Actions</h2>
          {selectedInvoice && (
            <div>
              <p>Client&apos;s Name: {selectedInvoice.client.company}</p>
              <p>Invoice ID Number: {selectedInvoice.number}</p>
              <p>Date: {selectedInvoice.date}</p>
              <p>Status: {selectedInvoice.status}</p>
  
            
              <button onClick={closeModal}>Close</button>
            </div>
          )}
        </Modal>
      </div>
    );
}

export default InvoiceTable