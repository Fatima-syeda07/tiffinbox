import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PendingCooks from "../components/admin/PendingCooks";
import AllListings from "../components/admin/AllListings";
import CustomersList from "../components/admin/CustomersList";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Welcome, {currentUser?.displayName || "Admin"}</p>
      </div>
      <div className="dashboard-tabs">
        <button
          className={activeTab === "pending" ? "tab active" : "tab"}
          onClick={() => setActiveTab("pending")}
        >
          ⏳ Pending Cooks
        </button>
        <button
          className={activeTab === "listings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("listings")}
        >
          🍽️ All Listings
        </button>
        <button
          className={activeTab === "customers" ? "tab active" : "tab"}
          onClick={() => setActiveTab("customers")}
        >
          👥 Customers
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "pending" && <PendingCooks />}
        {activeTab === "listings" && <AllListings />}
        {activeTab === "customers" && <CustomersList />}
      </div>
    </div>
  );
};

export default AdminDashboard;