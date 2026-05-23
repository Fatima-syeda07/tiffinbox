import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "customer"));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch orders for each customer
      const ordersSnap = await getDocs(collection(db, "orders"));
      const allOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const customersWithOrders = users.map(user => {
        const userOrders = allOrders.filter(order => order.userId === user.id);
        return {
          ...user,
          orders: userOrders,
          totalSpent: userOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        };
      });
      setCustomers(customersWithOrders);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading customers...</div>;
  if (customers.length === 0) return <div className="no-data">No customers found.</div>;

  return (
    <div className="customers-list">
      {customers.map(customer => (
        <div key={customer.id} className="customer-card">
          <div className="customer-header">
            <h3>{customer.fullName}</h3>
            <p>📧 {customer.email}</p>
            <p>📅 Registered: {new Date(customer.createdAt).toLocaleDateString()}</p>
            <p>💰 Total Spent: PKR{customer.totalSpent}</p>
          </div>
          {customer.orders.length > 0 && (
            <div className="customer-orders">
              <h4>Order History</h4>
              {customer.orders.map(order => (
                <div key={order.id} className="order-summary">
                  <p>📦 {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</p>
                  <p>Total: PKR{order.total}</p>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <span key={idx}>🍽️ {item.name} x{item.quantity}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomersList;