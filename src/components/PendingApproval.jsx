import { useAuth } from "../context/AuthContext";

const PendingApproval = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="pending-container">
      <div className="pending-card">
        <div className="pending-icon">⏳</div>
        <h2>Account Pending Approval</h2>
        <p>Thank you for registering as a Home Cook, {currentUser?.displayName}!</p>
        <p>Our admin will review your application shortly. You'll receive access to your seller dashboard once approved.</p>
        <div className="pending-note">
          <span>📧</span> Need help? Contact support@tiffinbox.com
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;