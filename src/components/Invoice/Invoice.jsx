import  { useState, useEffect } from 'react';
import styles from './Invoice.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import moment from 'moment';
import { toCommas } from '../../utils/utils';

import IconButton from '@mui/material/IconButton';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { initialState } from '../../redux/Invoice/initialState';
import { createInvoice, getInvoice, updateInvoice } from '../../redux/actions/invoice';
import { getClientsByUser } from '../../redux/actions/client';
import AddClient from '../Client/AddClient';
import {getTotals,fetchInvoices} from '../../api/index'


const Invoice = () => {
  const location = useLocation();
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [taxRate, setTaxRate] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState('');
  const { id } = useParams();
  const clients = useSelector((state) => state.clients.clients);
  const { invoice } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    getTotals();
  
  }, [location]);

 

  useEffect(() => {
    dispatch(getInvoice(id));
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    dispatch(getClientsByUser({ search: user?.result?._id || user?.result }));
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
      setTaxRate(invoice.taxRate);
      setClient(invoice.client);
      setStatus(invoice.status);
      setSelectedDate(invoice.date);
    }
  }, [invoice]);

//@desc default props for client
  const clientsProps = {
    options: clients,
    getOptionLabel: (option) => option.company,
  };

  //handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //get total TAX, TOTAL AMOUNT, SUBTOTAL
  useEffect(() => {
    // Fetch the total, subTotal, and totalTax from the API
    const fetchInvoiceTotals = async () => {
      try {
        const response = await fetchInvoices(); 
        const invoiceTotals = response.data; 

        setTotalAmount(invoiceTotals.totalAmount);
        setSubTotal(invoiceTotals.subTotal);
        setTotalTax(invoiceTotals.totalTax);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvoiceTotals();
  }, [invoiceData, subTotal, totalTax, totalAmount]);

  const handleRates = (e) => {
    setTaxRate(e.target.value);
    setInvoiceData((prevState) => ({ ...prevState, taxRate: e.target.value }));
  };

  const handleChange = (index, e) => {
    const values = [...invoiceData.items];
    values[index][e.target.name] = e.target.value;
    setInvoiceData({ ...invoiceData, items: values });
  };

 
  const handleAddField = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({ ...prevState, items: [...prevState.items,
         { dateServed: "",
         day: "",
         location: "",
         startTime: "",
         endTime: "",
         totalHours: "",
         ratePay: "",
         serviceType: "",
         }] }));
  };

  const handleRemoveField = (index) => {
    const values = invoiceData.items;
    values.splice(index, 1);
    setInvoiceData((prevState) => ({ ...prevState, values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invoice) {
      dispatch(updateInvoice(invoice._id, {
        ...invoiceData,
        subTotal: subTotal,
        totalAmount: totalAmount,
        totalTax:totalTax,
        taxRate: taxRate,
        dueDate: selectedDate,
        client,
        status,
      }));
      history(`/invoice/${invoice._id}`);
    } else {
      dispatch(createInvoice({
        ...invoiceData,
        subTotal: subTotal,
        totalAmount: totalAmount,
        totalTax: totalTax,
        taxRate: taxRate,
        dueDate: selectedDate,
        invoiceNumber: `${
          invoiceData.invoiceNumber < 100 ?
          (Number(invoiceData.invoiceNumber)).toString().padStart(3, '0') :
          Number(invoiceData.invoiceNumber)
        }`,
        client,
        status,
        creator: [user?.result?._id || user?.result],
      },
      history(`/invoice/${invoice._id}`)
      ));
    }
  };

  const [open, setOpen] = useState(false);

  const CustomPaper = (props) => {
    return <Paper elevation={3} {...props} />;
  };

  if (!user) {
    history('/login');
  }

  return (
    <div className={styles.invoiceLayout}>
        <form onSubmit={handleSubmit} className="mu-form">
            <AddClient setOpen={setOpen} open={open} />
            <Container  sx={{ 
                paddingTop: 1, 
                paddingLeft: 5,
                 paddingRight: 1 }}>
                
                <Grid container justifyContent="space-between" >
                    <Grid item>
                      
                    </Grid>
                    <Grid item>

                        Invoice #:
                        <div style={{
                            marginTop: '15px',
                            width: '100px',
                            padding: '8px',
                            display: 'inline-block',
                            backgroundColor: '#f4f4f4',
                            outline: '0px solid transparent'
                        }} 
                             contentEditable="true"                            
                            onInput={e => setInvoiceData({
                            ...invoiceData, invoiceNumber: e.currentTarget.textContent})
                            }
                        >
                        <span style={{width:'40px',
                            color: 'black',
                            padding: '15px',
                        }} 
                        contentEditable="true"  > {invoiceData.invoiceNumber}</span>
                        <br/>
                        </div>
                    </Grid>
                </Grid >
            </Container>
            <Divider />
            <Container>
                <Grid container justifyContent="space-between" style={{marginTop: '40px'}} >
                    <Grid item style={{width: '50%'}}>
                        <Container>
                            <Typography variant="overline" style={{color: 'gray', paddingRight: '3px'}} gutterBottom>Bill to</Typography>
                            

                            {client  && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom>{client.company}</Typography>
                                    <Typography variant="body2" >{client.email}</Typography>
                                    <Typography variant="body2" >{client.tel}</Typography>
                                    <Typography variant="body2">{client.address}</Typography>
            
                                    <Button color="primary" size="small" style={{textTransform: 'none'}} onClick={()=> setClient(null)}>Change</Button>
                                </>
                            )}
                            <div style={client? {display: 'none'} :  {display: 'block'}}>
                                <Autocomplete
                                            {...clientsProps}
                                            PaperComponent={CustomPaper}
                                                renderInput={(params) => <TextField {...params}
                                                required={!invoice && true} 
                                                label="Select Customer" 
                                                margin="normal" 
                                                variant="outlined"
                                                />}
                                            value={clients?.company}
                                            onChange={(event, value) => setClient(value)}
                                            
                                    />

                            </div>
                            {!client && 
                                <>
                                <Grid item style={{paddingBottom: '10px'}}>
                                    <Chip
                                        avatar={<Avatar>+</Avatar>}
                                        label="New Customer"
                                        onClick={() => setOpen(true)}
                                        variant="outlined"
                                    />
                                </Grid>
                                </>
                            }
                        </Container>
                    </Grid>

                    <Grid item style={{marginRight: 20, textAlign: 'right'}}>
                        <Typography variant="overline" style={{color: 'gray'}} gutterBottom>Status</Typography>
                        <Typography variant="h6" gutterBottom style={{color: (status === 'paid' ? 'green' : 'red')}}>{status}</Typography>
                        <Typography variant="overline" style={{color: 'gray'}} gutterBottom>Date</Typography>
                        <Typography variant="body2" gutterBottom>{moment().format("MMM Do YYYY")}</Typography>
                        <Typography variant="overline" style={{color: 'gray'}} gutterBottom>Due Date</Typography>
                        <Typography variant="body2" gutterBottom>{selectedDate? moment(selectedDate).format("MMM Do YYYY") : '27th Oct 2023'}</Typography>
                        <Typography variant="overline" gutterBottom>Amount</Typography>
                        <Typography variant="h6" gutterBottom>{"$"} {toCommas(totalAmount)}</Typography>
                    </Grid>
                </Grid>
            </Container>

        
    <div>

        <TableContainer component={Paper} className="tb-container">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell >Location</TableCell>
                <TableCell >Pay Rate</TableCell>
                <TableCell >Total Hours</TableCell>
                <TableCell >Action</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {invoiceData.items.map((itemField, index) => (
                <TableRow key={index}>
                <TableCell  scope="row" style={{width: '40%' }}> <InputBase style={{width: '100%'}} outline="none" sx={{ ml: 1, flex: 1 }} type="text" name="itemName" onChange={e => handleChange(index, e)} value={itemField.dateServed} placeholder="Date served eg(02/04/2023" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="date" name="dateServed" onChange={e => handleChange(index, e)} value={itemField.day} placeholder="e.g (Friday)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="datetime-local" name="startTime" onChange={e => handleChange(index, e)} value={itemField.startTime} placeholder="e.g(8:00AM or 21:00)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="datetime-local" name="endTime"  onChange={e => handleChange(index, e)} value={itemField.endTime} placeholder="e.g(8:00AM or 21:00)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="text" name="serviceType"  onChange={e => handleChange(index, e)} value={itemField.serviceType} placeholder="Night shift, Day, or Overnight shift" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="location"  onChange={e => handleChange(index, e)} value={itemField.location} placeholder="Brampton Senior home" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="ratePay"  onChange={e => handleChange(index, e)} value={itemField.ratePay} placeholder="Pay Rate ($)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="totalHours" onChange={e => handleChange(index, e)}  value={(itemField.totalHours)} disabled /> </TableCell>
                <TableCell align="right"> 
                    <IconButton onClick={() =>handleRemoveField(index)}>
                        <DeleteOutlineRoundedIcon style={{width: '20px', height: '20px'}}/>
                    </IconButton>
                </TableCell>
                
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
            <div className={styles.addButton}>
                <button onClick={handleAddField}>+</button>
            </div>
    </div>
                    
        <div className={styles.invoiceSummary}>
            <div className={styles.summary}>Invoice Summary</div>
            <div className={styles.summaryItem}>
                <p>Sub total:</p>
                <h4>{subTotal}</h4>
            </div>
            <div className={styles.summaryItem}>
                <p>H.S.T(%):</p>
                <h4>{taxRate}</h4>
            </div>
            <div className={styles.summaryItem}>
                <p>Total</p>
                <h4 style={{color: "black", fontSize: "18px", lineHeight: "8px"}}>{"$"} {toCommas(totalAmount)}</h4>
            </div>
            
        </div>

        
        <div className={styles.toolBar}>
            <Container >
                <Grid container >
                    <Grid item style={{marginTop: '16px', marginRight: 10}}>
                        <TextField 
                            type="text" 
                            step="any" 
                            name="rates" 
                            id="rates" 
                            value={taxRate} 
                            onChange={handleRates} 
                            placeholder="e.g 10" 
                            label="Tax Rates(%)"
                            
                        />
                    </Grid>
                    <Grid item style={{marginRight: 10}} >
                        
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Due date"
                                format="MM/dd/yyyy"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </ LocalizationProvider>
                    </Grid>
                </Grid>
                
            </Container>
        </div>
            <div className={styles.note}>
                <h4>Note</h4>
                <textarea 
                style={{border: 'solid 1px #d6d6d6', padding: '10px'}}
                    placeholder="Provide additional details or terms of service"
                    onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                    value={invoiceData.notes}
                />
            </div>

            {/* <button className={styles.submitButton} type="submit">Save and continue</button> */}
            <Grid container justifyContent="center">
            <Button
                variant="contained"
                style={{
                    justifyContentContent: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'white', 
                    backgroundColor: 'blue', 
                }}
                type="submit"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
               
            >
                Save and Continue
            </Button>
            </Grid>
        </form>
    </div>
    )
}

export default Invoice


   