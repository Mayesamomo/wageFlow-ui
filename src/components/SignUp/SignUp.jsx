import  { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import  API_URL  from '../../api/server';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
      toast.error('Password and Confirm Password do not match');
      return;
    }

    const data = { name, email, password };
    try {
      const response = await axios.post(`${API_URL}auth/register`, data);
      toast.success(response.data.message);
      navigate('/login');
      // Clear the input fields
      setname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-2 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-1xl text-center">Sign up</h1>

              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className={`block border border-grey-light w-full p-3 rounded`}
                  name="name"
                  value={name}
                  placeholder="Full Name"
                  onChange={(e) => setname(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className={`block border border-grey-light w-full p-3 rounded`}
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
                  className={`block border border-grey-light w-full p-3 rounded`}
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`block border border-grey-light w-full p-3 rounded`}
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-slate-900 text-white hover:bg-green-dark focus:outline-none my-1"
              >
                Create Account
              </button>
            </div>

            <div className="text-grey-dark my-4">
              Already have an account?{' '}
              <span className="no-underline border-b border-blue text-blue">
                <Link to={'/login'}>Login</Link>
              </span>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
