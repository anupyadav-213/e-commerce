import React, {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import "../styles/navbar.css";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems || []);
    const navigate = useNavigate();
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <img src="/logo.png" alt="Khazana Corner Logo" className="navbar-logo" />
                    Khazana Corner
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
                {user ? (
                    <>
                    <li><Link to="/profile">hi, {user.name}</Link></li>
                    {isAdmin && <li><Link to="/admin">Admin</Link></li>}
                    <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
                    </>
                    ) : (
                        <Link to="/login" className="btn-login">Login</Link>
                    )}
             </ul>
        </nav>
    );
};

export default Navbar;
