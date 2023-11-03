/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WageFlow from '../../assets/wageFlow_logo(1).png';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import styles from './Header.module.css';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Avatar from '@mui/material/Avatar';

const Header = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
},[location])

useEffect(()=> {
  const token = user?.token
 
  if(token) {
      const decodedToken = jwtDecode(token)
      if(decodedToken.exp * 1000 < new Date().getTime()) logout()
  }
  // eslint-disable-next-line
}, [location, user])

  const [open, setOpen] = useState(false);
  const anchorRef = React.createRef();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    history('/');
    setUser(null);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const openLink = (link) => {
    history(`/${link}`);
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  if (!user) {
    return (
      <div className={styles.header2}>
        <img
          style={{ width: '150px', cursor: 'pointer' }}
          onClick={() => history('/')}
          src={WageFlow}
          alt="WageFlow"
        />
        <Button onClick={() => history('/login')} className={styles.login}>
          Get started
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.header}>
      <div className="Mui-flex">
        <div>
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <Avatar style={{ backgroundColor: '#1976D2' }}>{user?.result?.name?.charAt(0)}</Avatar>
          </Button>
          <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper elevation={3}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      <MenuItem onClick={() => openLink('settings')}>
                        {user?.result?.name?.split(' ')[0]}
                      </MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default Header;
