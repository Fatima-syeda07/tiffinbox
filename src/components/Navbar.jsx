import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const itemCount = getTotalItems();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          🍱 TiffinBox
        </Link>
        <div className="nav-links">
          {currentUser ? (
            <>
              <span className="role-badge">
                {userRole === "customer"
                  ? "👤 Customer"
                  : userRole === "cook"
                  ? "👨‍🍳 Cook"
                  : "🛡️ Admin"}
              </span>
              <Link to="/products" className="nav-link">
                🍽️ Browse Meals
              </Link>
              {userRole === "cook" && (
                <Link to="/seller" className="nav-link">
                  👨‍🍳 My Dashboard
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/admin" className="nav-link">
                  🛡️ Admin Panel
                </Link>
              )}
              {userRole === "customer" && (
                <Link to="/cart" className="nav-link cart-link">
                  🛒 Cart {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                </Link>
              )}
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;