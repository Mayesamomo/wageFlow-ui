import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  API_URL  from '../../api/server';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => { 
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    const user = { email, password };
    try {
      const response = await axios.post(`${API_URL}auth/login`, user, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/dashboard');
        window.location.reload(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="py-30">
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-4 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-2xl text-center">Login</h1>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className={`block border border-grey-light w-full p-3 rounded mb-4`}
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className={`block border border-grey-light w-full p-3 rounded mb-4`}
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-slate-900 text-white hover-bg-green-dark focus:outline-none my-1"
              >
                Log In
              </button>
            </div>

            <div className="text-grey-dark mt-6">
                Don&rsquo;t have an account?{' '}
                <span className="no-underline border-b border-blue text-blue">
                    <Link to="/register">Register</Link>
                </span>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;