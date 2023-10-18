const invoiceEndpoint = import.meta.env.VITE_INVOICE;
export default invoiceEndpoint;

// Function to get all invoices
export const getAllInvoices = async () => {
  try {
    const response = await fetch(`${invoiceEndpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all invoices:', error);
    throw error;
  }
};

// Function to get an invoice by ID
export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await fetch(`${invoiceEndpoint}/${invoiceId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    throw error;
  }
};

// Function to get recent invoices
export const getRecentInvoices = async () => {
  try {
    const response = await fetch(`${invoiceEndpoint}/recent`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    throw error;
  }
};

// Function to delete an invoice by ID
export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await fetch(`${invoiceEndpoint}/${invoiceId}`, {
      method: 'DELETE',
    });
    if (response.status === 204) {
      return true;
    } else {
      throw new Error(`Failed to delete invoice with ID ${invoiceId}`);
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

// Function to update an invoice
export const updateInvoice = async (invoiceId, updatedInvoiceData) => {
  try {
    const response = await fetch(`${invoiceEndpoint}/${invoiceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedInvoiceData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};


// Function to get recent invoices and sort them by date
export const getRecentInvoicesSortedByDate = async () => {
  try {
    const response = await fetch(`${invoiceEndpoint}`);
    const data = await response.json();
 
    // Sort invoices by date in descending order (most recent first)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    return data;
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    throw error;
  }
};


