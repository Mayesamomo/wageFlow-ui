import { Outlet, Link } from "react-router-dom";

export default function Layout() {
return(
    <>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
    </nav>
    <main>
        <Outlet />
    </main>
    </>
)
 }