import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. Your meal kits will be delivered soon.</p>
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;