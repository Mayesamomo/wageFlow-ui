/* eslint-disable react/prop-types */
import { FaBars, FaBell, FaUser } from 'react-icons/fa';

// eslint-disable-next-line no-unused-vars
const Header = ({ toggleSidebar }) => {
  return (
    <div className="bg-white text-white shadow w-full p-2 flex items-center justify-between">
    <div className="flex items-center">
      <div className="hidden md:flex items-center">
        <img
          src="https://www.emprenderconactitud.com/img/POC%20WCS%20(1).png"
          alt="Logo"
          className="w-28 h-18 mr-2"
        />
        <h2 className="font-bold text-xl">WageFlow Pro</h2>
      </div>
      <div className="md:hidden flex items-center">
      <button id="menuBtn" onClick={toggleSidebar}>
            <FaBars className="text-gray-500 text-lg" />
          </button>
      </div>
    </div>

    <div className="space-x-5">
      <button>
        <FaBell className="text-gray-500 text-lg" /> 
      </button>
      <button>
        <FaUser className="text-gray-500 text-lg" /> 
      </button>
    </div>
  </div>
  );
};

export default Header;
