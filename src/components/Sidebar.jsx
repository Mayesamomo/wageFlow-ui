/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaStore,
  FaExchangeAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import menuItems from '../constants/MenuItems';

const Sidebar = ({ isOpen }) => {
  const sidebarClass = isOpen ? 'p-2 bg-white w-60 flex flex-col' : 'hidden';
  return (
    <div className={sidebarClass} id="sideNav">
      <nav>
        {menuItems.map((menuItem, index) => (
          <a
            key={index}
            href={menuItem.href}
            className={`block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white ${menuItem.active ? 'text-white bg-gradient-to-r from-cyan-400 to-cyan-300' : ''}`}
          >
            {menuItem.icon} <span className="mr-2">{menuItem.text}</span>
          </a>
        ))}
      </nav>

      {/* Item for logging out */}
      <a className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white mt-auto" href="#">
        <FaSignOutAlt className="mr-2" /> Logout
      </a>

      {/* Location indicator */}
      <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mt-2"></div>

      {/* Copyright at the end of the sidebar */}
      <p className="mb-1 px-5 py-3 text-left text-xs text-cyan-500">Copyright WageFlow{" "}@{new Date().getFullYear()}</p>
    </div>
  );
};

export default Sidebar;