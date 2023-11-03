import  { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import axios from 'axios';

const AddInvoice = () => {
  const [formData, setFormData] = useState({
    client: null,
    date: '',
    items: [],
  });

  const [clients, setClients] = useState([]);
  
  // Fetch clients from the API (replace with your API endpoint)
  useEffect(() => {
    axios.get('/api/clients') // Adjust the API route
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching clients:', error);
      });
  }, []);

  const handleClientChange = (event, newValue) => {
    setFormData({ ...formData, client: newValue });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    // Add an empty item to the items array
    setFormData({
      ...formData,
      items: [...formData.items, {}],
    });
  };

  const handleItemChange = (index, field, value) => {
    // Update the item's field at the specified index
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Send a POST request to create the invoice (replace with your API endpoint)
    axios.post('/api/invoices', formData) // Adjust the API route
      .then((response) => {
        console.log('Invoice created:', response.data);
        // Redirect to the invoice details page or reset the form
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Create Invoice
      </Typography>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          id="client-autocomplete"
          options={clients}
          getOptionLabel={(option) => option.name}
          value={formData.client}
          onChange={handleClientChange}
          renderInput={(params) => <TextField {...params} label="Client" />}
        />
        <TextField
          type="date"
          name="date"
          label="Date"
          value={formData.date}
          onChange={handleInputChange}
        />
        <Typography variant="h5" gutterBottom>
          Invoice Items
        </Typography>
        {formData.items.map((item, index) => (
          <div key={index}>
            <TextField
              name="itemName"
              label="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(e, index)}
            />
            {/* Add more fields for item details (quantity, price, etc.) */}
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Create Invoice
        </Button>
      </form>
    </Container>
  );
};

export default AddInvoice;
