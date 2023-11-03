/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const NavItem = ({ path, icon, text }) => {
  return (
    <li className="nav-item">
      <Link to={path} className="nav-link">
        {icon}
        <span className="link-text">{text}</span>
      </Link>
    </li>
  );
};

export default NavItem;
