import { useState, useEffect } from "react";   // ✅ ADDED useEffect here
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, getTotalItems } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        await addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          userName: currentUser.displayName,
          items: cartItems,
          total: getCartTotal(),
          status: "completed",
          createdAt: new Date(),
        });
        clearCart();
        setOrderPlaced(true);   // Signal that order is complete
      } catch (error) {
        console.error("Order save failed:", error);
        alert("Order failed. Please try again.");
        setLoading(false);
      }
    }, 1500);
  };

  // Redirect to confirmation page once order is placed
  useEffect(() => {
    if (orderPlaced) {
      navigate("/order-confirmation", { replace: true });
    }
  }, [orderPlaced, navigate]);

  if (cartItems.length === 0 && !orderPlaced) {
    navigate("/cart", { replace: true });
    return null;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="order-review">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>PKR{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total ({getTotalItems()} items)</span>
            <span>PKR{getCartTotal()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <h3>Payment Details (Demo)</h3>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter Your Name"
            />
          </div>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              placeholder="4242 4242 4242 4242"
              maxLength="19"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry (MM/YY)</label>
              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                required
                placeholder="12/28"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="pay-btn">
            {loading ? "Processing..." : `Pay PKR${getCartTotal()}`}
          </button>
          <p className="demo-note">
            * This is a simulated payment. No real transaction occurs.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Checkout;