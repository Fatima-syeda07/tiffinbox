import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getGroupedByCook,
    getTotalItems,
  } = useCart();
  const navigate = useNavigate();

  const grouped = getGroupedByCook();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any meals yet.</p>
        <Link to="/products" className="continue-shopping-btn">
          Browse Meals
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {Object.entries(grouped).map(([cookName, items]) => (
            <div key={cookName} className="cart-group">
              <div className="cart-group-header">👩‍🍳 {cookName}</div>
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <div className="cart-item-price">PKR{item.price}</div>
                    <div className="cart-item-actions">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    PKR{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>PKR{getCartTotal()}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;