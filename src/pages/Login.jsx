import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { login } from "../api/ApiService";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFieldErrors = { ...fieldErrors };

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

    setFieldErrors(newFieldErrors);

    if (newFieldErrors.email || newFieldErrors.password) {
      handleError("All fields are required.");
      return;
    }

    try {
      const { success, message } = await login(email, password);

      if (success) {
        setTimeout(() => {
          handleSuccess(message);
          navigate("/dashboard"); 
        }, 1000);
      } else {
        handleError(message);
      }
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

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-slate-900 text-white hover:bg-green-dark focus:outline-none my-1"
              >
                Log In
              </button>
            </div>

            <div className="text-grey-dark mt-6">
              Don&apos;t have an account?{" "}
              <span className="no-underline border-b border-blue text-blue">
                <Link to={"/register"}>Register</Link>
              </span>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
