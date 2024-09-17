import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import { useContext } from "react";
function Navigations({ handleLogout }) {
  const {token, setToken} = useContext(TokenContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/products");
  };

  return (
    <nav id="navBar">
      <ul>
        <li className="navLinks">
          <Link to="/products">Home</Link>
        </li>
        {!token ? (
          <>
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

            <li className="navLinks">
              <Link to="/cart">Cart</Link>
            </li>

            {/* if user is admin then this will show: */}
            {isAdmin && (
              <li className="navLinks">
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}

            <li className="navLinks">
              <Link to="/products" onClick={handleLogoutClick}>
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
