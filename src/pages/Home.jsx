 import { useNavigate } from "react-router-dom";
import wageFlow from "../assets/wageFlow_logo.png";

const Home = () => {
  const navigate = useNavigate();
  // const USER = import.meta.env.VITE_USER

  const goLogin = () => {
    // localStorage.setItem("user", JSON.stringify({ role: USER }));
    navigate("/login");
  };

  return (
    <div>
      <header className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <nav className="flex items-center py-8 px-14 justify-between">
          <div className="flex items-center">
            <img className="w-40 h-10" src={wageFlow} alt="WageFlow Logo" />
          </div>
          <div className="lg:flex hidden items-center space-x-3 py-3 px-6 bg-indigo-600 text-white rounded-lg transition-all duration-400 transform hover:scale-105 cursor-pointer hover:shadow-lg">
          <button onClick={goLogin}>Get Started</button>

            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </span>
          </div>
        </nav>
        {/* End Navigation Bar */}
  
        {/* Section Hero */}
        {/* Box left */}
        <div className="md:flex space-x-16 mt-20 md:mr-0 mr-10">
          <div className="md:flex items-center pl-16">
            <div>
              <h1 className="lg:text-5xl font-bold leading-tight text-3xl">
                Sophisticated Invoicing Solution
              </h1>
              <p className="mt-4 text-lg font-normal">
                &ldquo;Streamline your invoicing process with our state-of-the-art web application. 
                Experience a seamless and efficient workflow designed specifically to meet the needs of personal support workers,
                travel nurses, and other healthcare professionals.&rdquo;
              </p>
              <div className="flex mt-10 w-40 items-center space-x-3 py-3 px-6 bg-indigo-600 text-white rounded-lg transition-all duration-400 transform hover:scale-105 cursor-pointer hover:shadow-lg">
                <button onClick={goLogin}>Get Started</button>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          {/* Box right */}
          <div className="max-w-lg pr-24 md:flex justify-center items-center hidden">
            <img
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1483058712412-4245e9b90334"
              alt=""
            />
          </div>
        </div>
      </header>
      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto flex justify-center">
          <p className="text-gray-300">
            Designed and Developed by Michael Momo
          </p>
          <a
            href="https://michaeljaems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-gray-100 transition duration-300 ml-4"
          >
            Visit Michael Momo
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
