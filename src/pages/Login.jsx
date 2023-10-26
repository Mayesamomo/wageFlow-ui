import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../utils/AuthContext';

export default function Login() {
  const { user, handleLogin } = useAuth();
  const navigate = useNavigate();
  const loginForm = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation here
    if (!email || !password) {
      setFieldErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    try {
      await handleLogin({ email, password });
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <form ref={loginForm} onSubmit={handleSubmit} className="py-30">
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-4 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-2xl text-center">Login</h1>

              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                className={`block border border-grey-light w-full p-3 rounded mb-4 ${
                  fieldErrors.email ? "border-red-500" : ""
                }`}
                name="email"
                value={email}
                placeholder="Email"
                onChange={handleOnChange}
              />
              {fieldErrors.email && (
                <div className="text-red-500">{fieldErrors.email}</div>
              )}

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className={`block border border-grey-light w-full p-3 rounded mb-4 ${
                  fieldErrors.password ? "border-red-500" : ""
                }`}
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleOnChange}
              />
              {fieldErrors.password && (
                <div className="text-red-500">{fieldErrors.password}</div>
              )}

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-slate-900 text-white hover-bg-green-dark focus:outline-none my-1"
              >
                Log In
              </button>
            </div>

            <div className="text-grey-dark mt-6">
              Don&apos;t have an account?{" "}
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
