import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { register } from "../api/ApiService";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = user;
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleError = (err) => {
    const errorMessage =
      err.response && err.response.data ? err.response.data.error : "Request failed with status code " + err.response.message;
    toast.error(errorMessage, {
      position: "bottom-left",
    });
  };

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const newFieldErrors = { ...fieldErrors };
    
      if (!name) {
        newFieldErrors.name = true;
      } else {
        newFieldErrors.name = false;
      }
    
      if (!email) {
        newFieldErrors.email = true;
      } else {
        newFieldErrors.email = false;
      }
    
      if (!password) {
        newFieldErrors.password = true;
      } else {
        newFieldErrors.password = false;
      }
    
      if (!confirmPassword) {
        newFieldErrors.confirmPassword = true;
      } else {
        newFieldErrors.confirmPassword = false;
      }
    
      setFieldErrors(newFieldErrors);
    
      if (
        newFieldErrors.name ||
        newFieldErrors.email ||
        newFieldErrors.password ||
        newFieldErrors.confirmPassword
      ) {
        handleError("All fields are required.");
        return;
      }
    
      if (password !== confirmPassword) {
        handleError("Passwords do not match.");
        return;
      }
    
      try {
        const { success, message } = await register({ name, email, password });
    
        if (success) {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          handleError(message);
        }
        handleSuccess(message);
        navigate("/login");
      } catch (error) {
        console.log(error);
        handleError(error.message);
      }
    };

  return (
    <div>
      <form onSubmit={handleSubmit} className="py-30">
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-4 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-2xl text-center">Sign up</h1>

              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className={`block border border-grey-light w-full p-3 rounded mb-4 ${
                  fieldErrors.name ? "border-red-500" : ""
                }`}
                name="name"
                value={name}
                placeholder="Full Name"
                onChange={handleOnChange}
              />

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

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className={`block border border-grey-light w-full p-3 rounded mb-4 ${
                  fieldErrors.confirmPassword ? "border-red-500" : ""
                }`}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={handleOnChange}
              />

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-slate-900 text-white hover:bg-green-dark focus:outline-none my-1"
              >
                Create Account
              </button>
            </div>

            <div className="text-grey-dark mt-6">
              Already have an account?{" "}
              <span className="no-underline border-b border-blue text-blue">
                <Link to={"/login"}>Login</Link>
              </span>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
