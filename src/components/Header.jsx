/* eslint-disable react/prop-types */
import  { useState,useRef, useEffect } from 'react'
import { FaBars, FaBell, FaUser } from 'react-icons/fa';
import wageFlowLogo from '../assets/wageFlow_logo.png';
import ProFileCard from './modals/ProFileCard';
// eslint-disable-next-line no-unused-vars
const Header = ({ toggleSidebar }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const closeModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeModal);
    return () => {
      document.removeEventListener('mousedown', closeModal);
    };
  }, []);
  return (
    <div className="bg-white text-white shadow w-full p-2 flex items-center justify-between">
      <div className="flex items-center">
        <div className="hidden md:flex items-center">
          <img
            src={wageFlowLogo}
            alt="Logo"
            className="w-28 h-18 mr-2"
          />
          <h2 className="font-bold text-xl">WageFlow Pro</h2>
        </div>
        <div className="md:hidden flex items-center">
          <button id="menuBtn" onClick={toggleSidebar}>
            <FaBars className="text-gray-500 text-lg" />
          </button>
          {isModalOpen && (
            <ProFileCard />
          )}
        </div>
      </div>

      <div className="space-x-5 mr-2">
        <button>
          <FaBell className="text-gray-500 text-lg" />
        </button>
        <button onClick={toggleModal}>
          <FaUser className="text-gray-500 text-lg hover:text-blue-300" />
        </button>
      </div>
    </div>
  );
};

export default Header;
