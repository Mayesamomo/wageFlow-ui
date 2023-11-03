/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInvoicesByUser } from '../../redux/actions/invoice';
import { toCommas } from '../../utils/utils';
import styles from './Dashboard.module.css'
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import Empty from '../../components/SvgIcons/Empty';
import moment from 'moment';
import Spinner from '../../components/Spinner/Spinner';
import { getRecentInvoices } from '../../api/index';


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const { invoices, isLoading } = useSelector((state) => state?.invoices);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    dispatch(getInvoicesByUser({ search: user?.result._id || user?.result }));
    // Fetch recent invoices
    getRecentInvoices()
      .then((response) => {
        setRecentInvoices(response.data); // Assuming the API response is an array of recent invoices
      })
      .catch((error) => {
        console.error('Error fetching recent invoices', error);
      });
  }, [dispatch]);



  if (!user) {
    navigate('/login');
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px' }}>
        <Spinner />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px' }}>
        <Empty />
        <p style={{ padding: '40px', color: 'gray' }}>Nothing to display. Click the plus icon to start creating</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <section className={styles.stat}>
        <Grid container spacing={3}>
          {/* ... (rest of the code remains the same) */}
        </Grid>
      </section>

      <section>
        <h1 style={{ textAlign: 'center', padding: '30px' }}>{recentInvoices.length ? 'Recent Invoices' : 'No recent invoices yet'}</h1>
        <div>
          {/* Render the list of recent invoices */}
          <div className={styles.table}>
            <table>
              <tbody>
                <tr>
                  <th style={{ padding: '15px' }}></th>
                  <th style={{ padding: '15px' }}>Client</th>
                  <th style={{ padding: '15px' }}>Date</th>
                  <th style={{ padding: '15px' }}>Amount</th>
                  <th style={{ padding: '15px' }}>Tax</th>
                  <th style={{ padding: '15px' }}>Note</th>
                </tr>
                {recentInvoices.map((invoice) => (
                  <tr className={styles.tableRow} key={invoice._id}>
                    <td><button>{invoice?.client?.charAt(0)}</button></td>
                    <td>{invoice.client.company}</td>
                    <td>{moment(invoice.date).format('MMMM Do YYYY')}</td>
                    <td><h3 style={{ color: '#00A86B', fontSize: '14px' }}>{toCommas(invoice.totalAmount)}</h3></td>
                    <td>{invoice.taxRate}</td>
                    <td>{invoice.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
