import  { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import NavItem from './NavItem'
import navLink from './navLinks'
import wageFlowLogo from '../../assets/wageFlow_logo(1).png'
const SideBar = () => {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  if (!user) return null;

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="logo">
            <Link to="/dashboard" className="nav-link">
              <span className="link-text logo-text">
                <img style={{ width: '50px' }} src={wageFlowLogo} />
              </span>
              <i data-feather="arrow-right" />
            </Link>
          </li>
          {navLink.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default SideBar