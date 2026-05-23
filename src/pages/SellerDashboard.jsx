import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MyProductsList from "../components/MyProductsList";
import AddEditProduct from "./AddEditProduct";

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("myProducts");

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>👨‍🍳 Seller Dashboard</h1>
        <p>Welcome back, {currentUser?.displayName || "Cook"}!</p>
      </div>
      <div className="dashboard-tabs">
        <button
          className={activeTab === "myProducts" ? "tab active" : "tab"}
          onClick={() => setActiveTab("myProducts")}
        >
          My Meal Kits
        </button>
        <button
          className={activeTab === "addProduct" ? "tab active" : "tab"}
          onClick={() => setActiveTab("addProduct")}
        >
          + Add New Meal Kit
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "myProducts" && <MyProductsList />}
        {activeTab === "addProduct" && <AddEditProduct />}
      </div>
    </div>
  );
};

export default SellerDashboard;