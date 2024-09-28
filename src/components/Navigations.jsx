import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import SearchBar from "./SearchBar";

function Navigations() {
  const {token,isAdmin,logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout()
    navigate("/home");
  };

  return (
    <nav id="navBar">
      <ul>
        <li className="navLinks">
          <Link to="/home">Home</Link>
        </li>
        <li className="navLinks">
              <Link to="/checkout">Checkout</Link>
            </li>
        {!token ? (
          <>
            <li className="navSearch">
              <SearchBar/>
            </li>
            <li className="navLinks">
              <Link to="/login">Login</Link>
            </li>

            <li className="navLinks">
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li className="navLinks">
              <Link to="/account">Account</Link>
            </li>
            <li>
              <SearchBar/>
            </li>
            {/* if user is admin then this will show: */}
            {isAdmin && (
              <li className="navLinks">
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}

            <li className="navLinks">
              <Link to="/home" onClick={handleLogoutClick}>
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigations;
