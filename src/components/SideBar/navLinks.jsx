import { FaPlus, FaLayerGroup, FaUsers, FaCog } from 'react-icons/fa';
import {BsFillPieChartFill} from 'react-icons/bs';
const navLinks = [
  { path: '/dashboard', icon: <BsFillPieChartFill />, text: 'Dashboard' },
  { path: '/invoice', icon: <FaPlus />, text: 'Create' },
  { path: '/invoices', icon: <FaLayerGroup />, text: 'Invoices' },
  { path: '/customers', icon: <FaUsers />, text: 'Clients' },
  { path: '/settings', icon: <FaCog />, text: 'Settings' },
];

export default navLinks;
