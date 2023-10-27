/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignUp from '../components/SignUp/SignUp';
export default function Register() {
const navigate = useNavigate(); 
const{isAuthenticated} = useSelector(state => state.user);


useEffect(() => {
if(isAuthenticated ===true){
  navigate("/dashboard");
}
}, []);
return (
<div> 
  <SignUp />
</div>
);
}
