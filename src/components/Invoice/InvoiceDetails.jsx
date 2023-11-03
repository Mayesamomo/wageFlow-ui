import { useState, useEffect } from 'react';
import { useLocation, useParams,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initialState } from '../../redux/Invoice/initialState';
import { getInvoice } from '../../redux/actions/invoice';
import { toCommas } from '../../utils/utils';
import moment from 'moment';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Container, Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Spinner from '../Spinner/Spinner';
import ProgressButton from 'react-progress-button';
import styles from './InvoiceDetails.module.css';
import { saveAs } from 'file-saver';
import {toast} from 'react-toastify';
import { fetchInvoice } from '../../api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';

const InvoiceDetails = () => {

    const location = useLocation()
    const [invoiceData, setInvoiceData] = useState(initialState)
    const [taxRate, setTaxRate] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [ client, setClient] = useState([])
    const [status, setStatus ] = useState('')
    const [company, setCompany] = useState({})
    const { id } = useParams()
    const { invoice } = useSelector((state) => state.invoices)
    const dispatch = useDispatch()
    const history = useNavigate()
    const [sendStatus, setSendStatus] = useState(null)
    const [downloadStatus, setDownloadStatus] = useState(null)
    // eslint-disable-next-line

    const user = JSON.parse(localStorage.getItem('profile'))
    
   

    useEffect(() => {
        dispatch(getInvoice(id));
      },[id, dispatch, location]);

      useEffect(() => {
        if(invoice) {
            setInvoiceData(invoice)
            setClient(invoice.client)
            setStatus(invoice.status)
            setSelectedDate(invoice.dueDate)
            setTaxRate(invoice.taxRate)
            setSubTotal(invoice.subTotal)
            setTotalAmount(invoice.totalAmount)
            setCompany(invoice?.businessDetails?.data?.data)
           
        }
    }, [invoice])


  const editInvoice = (id) => {
    history.push(`/edit/invoice/${id}`)
  }

  const createAndDownloadPdf = () => {
    setDownloadStatus('loading')
    axios.post("http://localhost:5000/create-pdf", 
    { name: invoice.client.company,
      address: invoice.client.address,
      phone: invoice.client.tel,
      email: invoice.client.email,
      dueDate: invoice.date,
      date: invoice.createdAt,
      id: invoice.invoiceNumber,
      notes: invoice.notes,
      subTotal: toCommas(invoice.subTotal),
      totalAmount: toCommas(invoice.total),
      taxRate: invoice.taxRate,
      items: invoice.items,
      status: invoice.status,
      company: company,
  })
      .then(() => axios.get("http://localhost:5000/fetch-pdf", { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

        saveAs(pdfBlob, 'invoice.pdf')
      }).then(() =>  setDownloadStatus('success'))
  }


  //SEND PDF INVOICE VIA EMAIL
  const sendPdf = (e) => {
    e.preventDefault()
    setSendStatus('loading')
    axios.post("http://localhost:5000/send-pdf", 
    { name: invoice.client.company,
      address: invoice.client.address,
      phone: invoice.client.tel,
      email: invoice.client.email,
      dueDate: invoice.date,
      date: invoice.createdAt,
      id: invoice.invoiceNumber,
      notes: invoice.notes,
      subTotal: toCommas(invoice.subTotal),
      totalAmount: toCommas(invoice.totalAmount),
        taxRate: invoice.taxRate,
      items: invoice.items,
      status: invoice.status,
      link: fetchInvoice(invoice._id),
      company: company,
  })
  // .then(() => console.log("invoice sent successfully"))
  .then(() => setSendStatus('success'))
      .catch((error) => {
        console.log(error)
        setSendStatus('error')
      })
  }


const iconSize = {height: '18px', width: '18px', marginRight: '10px', color: 'gray'}


if(!invoice) {
  return (
    <Spinner />
  )
}


    return (
        <div className={styles.PageLayout}>
           {invoice?.creator?.includes(user?.result?._id || user?.result) && (
            <div className={styles.buttons}>
                  <ProgressButton 
                    onClick={sendPdf} 
                    state={sendStatus}
                    onSuccess={()=> toast("Invoice sent successfully")}
                  >
                  Send to Customer
                  </ProgressButton>
              
                <ProgressButton 
                  onClick={createAndDownloadPdf} 
                  state={downloadStatus}>
                  Download PDF
                </ProgressButton>

                <button 
                className={styles.btn}  
                onClick={() => editInvoice(invoiceData._id)}
                > 
                <BorderColorIcon style={iconSize} 
                />
                Edit Invoice
                </button>
            </div>
             )}

           
            <div className={styles.invoiceLayout}>
        <Container  style={{
            paddingTop: 1,
            paddingLeft:5,
            paddingRight: 1,
            backgroundColor: '#f2f2f2',
            borderRadius: '10px 10px 0px 0px'
        }}>
        
            <Grid container justifyContent="space-between" style={{padding: '30px 0px' }}>
            {!invoice?.creator?.includes(user?.result._id || user?.result) ? 
            (
              <Grid item>
              </Grid>
            )
            : (
                <Grid item onClick={() => history.push('/settings')} style={{cursor: 'pointer'}}>
                    {company?.logo ? <img src={company?.logo} alt="Logo" className={styles.logo} /> 
                    :
                    <h2>{company?.name}</h2>
                    }
                </Grid>
            )}
                <Grid item style={{marginRight: 40, textAlign: 'right'}}>
                    <Typography variant="overline" style={{color: 'gray'}} >No: </Typography>
                    <Typography variant="body2">{invoiceData?.invoiceNumber}</Typography>
                </Grid>
            </Grid >
        </Container>
        <Divider />
        <Container>
            <Grid container justifyContent="space-between" style={{marginTop: '40px'}} >
                <Grid item>
                    {invoice?.creator?.includes(user?.result._id) && (
                      <Container style={{marginBottom: '20px'}}>
                        <Typography variant="overline" style={{color: 'gray'}} gutterBottom>From</Typography>
                        <Typography variant="subtitle2">{invoice?.businessDetails?.data?.data?.businessName}</Typography>
                        <Typography variant="body2">{invoice?.businessDetails?.data?.data?.email}</Typography>
                        <Typography variant="body2">{invoice?.businessDetails?.data?.data?.phoneNumber}</Typography>
                        <Typography variant="body2" gutterBottom>{invoice?.businessDetails?.data?.data?.address}</Typography>
                      </Container>
                    )}
                    <Container>
                        <Typography variant="overline" style={{color: 'gray', paddingRight: '3px'}} gutterBottom>Bill to</Typography>
                        <Typography variant="subtitle2" gutterBottom>{client.company}</Typography>
                        <Typography variant="body2" >{client?.email}</Typography>
                        <Typography variant="body2" >{client?.tel}</Typography>
                        <Typography variant="body2">{client?.address}</Typography>
                    </Container>
                </Grid>

                <Grid item style={{marginRight: 20, textAlign: 'right'}}>
                    <Typography variant="overline" style={{color: 'gray'}} gutterBottom>Status</Typography>
                    <Typography variant="h6" gutterBottom style={status}></Typography>
                    <Typography variant="overline" style={{color: 'gray'}} gutterBottom>Date</Typography>
                    <Typography variant="body2" gutterBottom>{moment().format("MMM Do YYYY")}</Typography>
                    <Typography variant="overline" style={{color: 'gray'}} gutterBottom>Due Date</Typography>
                    <Typography variant="body2" gutterBottom>{selectedDate? moment(selectedDate).format("MMM Do YYYY") : '27th Oct 2023'}</Typography>
                    <Typography variant="overline" gutterBottom>Amount</Typography>
                    <Typography variant="h6" gutterBottom>{"$"} {toCommas(totalAmount)}</Typography>
                </Grid>
            </Grid>
        </Container>

        <form>
            <div>

    <TableContainer component={Paper}>
      <Table style={{
          minWidth: 650,
      }} aria-label="simple table">
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
          {invoiceData?.items?.map((itemField, index) => (
            <TableRow key={index}>
              <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="date" name="dateServed" value={itemField.day} placeholder="e.g (Friday)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="datetime-local" name="startTime"  value={itemField.startTime} placeholder="e.g(8:00AM or 21:00)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="datetime-local" name="endTime"   value={itemField.endTime} placeholder="e.g(8:00AM or 21:00)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="text" name="serviceType"   value={itemField.serviceType} placeholder="Night shift, Day, or Overnight shift" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="location"   value={itemField.location} placeholder="Brampton Senior home" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="ratePay"   value={itemField.ratePay} placeholder="Pay Rate ($)" /> </TableCell>
                <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="totalHours"   value={(itemField.totalHours)} disabled /> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
                <div className={styles.addButton}>
                </div>
            </div>
                
                <div className={styles.invoiceSummary}>
                    <div className={styles.summary}>Invoice Summary</div>
                    <div className={styles.summaryItem}>
                        <p>Subtotal:</p>
                        <h4>{subTotal}</h4>
                    </div>
                    <div className={styles.summaryItem}>
                        <p>{`H.S.T(${taxRate}%):`}</p>
                        <h4>{taxRate}</h4>
                    </div>
                    <div className={styles.summaryItem}>
                        <p>Total</p>
                        <h4>{"$"} {toCommas(totalAmount)}</h4>
                    </div>
                </div>

                <div className={styles.note}>
                    <h4 style={{marginLeft: '-10px'}}>Note</h4>
                    <p style={{fontSize: '14px'}}>{invoiceData.notes}</p>
                </div>
        </form>
    </div>
        </div>
        
    )
}

export default InvoiceDetails
