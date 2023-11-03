/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInvoicesByUser } from '../../redux/actions/invoice';
import styles from './dashboard.module.css'
import { Navigate} from 'react-router-dom';
import { Grid } from '@mui/material';
import Empty from '../../components/SvgIcons/Empty';
import Spinner from '../../components/Spinner/Spinner';
import { getRecentInvoices } from '../../api/index';
import RecentInvoicesTable from '../../components/Invoice/RecentInvoice';

const Dashboard = () => {

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const { invoices, isLoading } = useSelector((state) => state?.invoices);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    dispatch(getInvoicesByUser({ search: user?.result._id || user?.result }));
    // Fetch recent invoices
    getRecentInvoices()
      .then((response) => {
        setRecentInvoices(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching recent invoices', error);
      });
  }, [dispatch]);



  if (!user) {
    Navigate('/login');
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
          
        </Grid>
      </section>

      <section>
        <h1 style={{ textAlign: 'center', padding: '30px' }}>
          {recentInvoices.length ? 'Recent Invoices' : 'No recent invoices yet'}
          </h1>
        <div>
          {/* Render the list of recent invoices */}
          <div className={styles.table}>
            <RecentInvoicesTable invoices={recentInvoices} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
