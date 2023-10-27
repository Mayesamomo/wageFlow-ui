/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from '../components/LogIn/Login';
export default function LoginPage() {
  const navigate = useNavigate();
  const{isAuthenticated} = useSelector(state => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
}
  


