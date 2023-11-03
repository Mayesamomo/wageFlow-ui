/* eslint-disable react/prop-types */
import moment from 'moment';
import styles from './Invoice.module.css';
import { toCommas } from '../../utils/utils';

const RecentInvoicesTable = ({ recentInvoices }) => {
  return (
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
              <td>
                <button>{invoice?.client?.charAt(0)}</button>
              </td>
              <td>{invoice.client.company}</td>
              <td>{moment(invoice.date).format('MMMM Do YYYY')}</td>
              <td>
                <h3 style={{ color: '#00A86B', fontSize: '14px' }}>
                  {toCommas(invoice.totalAmount)}
                </h3>
              </td>
              <td>{invoice.taxRate}</td>
              <td>{invoice.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentInvoicesTable;
