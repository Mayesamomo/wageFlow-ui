import { FaHome, FaFileAlt, FaUsers,FaExchangeAlt  } from "react-icons/fa";
const menuItems = [
    {
      icon: <FaHome />,
      text: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <FaFileAlt />,
      text: "Invoices",
      href: "/invoice",
    },
    {
      icon: <FaUsers />,
      text: "Clients",
      href: "/client",
    },
    
    {
      icon: <FaExchangeAlt />,
      text: "Expenses",
      href: "/expense",
    },
   
  ];
  
  export default menuItems;
  