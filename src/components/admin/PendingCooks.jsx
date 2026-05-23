import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const PendingCooks = () => {
  const [pendingCooks, setPendingCooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCooks();
  }, []);

  const fetchPendingCooks = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "cook"), where("approved", "==", false));
      const snapshot = await getDocs(q);
      const cooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingCooks(cooks);
    } catch (error) {
      console.error("Error fetching pending cooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveCook = async (cookId) => {
    try {
      await updateDoc(doc(db, "users", cookId), { approved: true });
      setPendingCooks(pendingCooks.filter(cook => cook.id !== cookId));
      alert("Cook approved successfully!");
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve cook.");
    }
  };

  const rejectCook = async (cookId) => {
    if (window.confirm("Are you sure you want to delete this cook's account?")) {
      try {
        await deleteDoc(doc(db, "users", cookId));
        setPendingCooks(pendingCooks.filter(cook => cook.id !== cookId));
        alert("Cook rejected and removed.");
      } catch (error) {
        console.error("Rejection failed:", error);
        alert("Failed to reject cook.");
      }
    }
  };

  if (loading) return <div className="loading">Loading pending approvals...</div>;

  if (pendingCooks.length === 0) {
    return <div className="no-data">No pending cook approvals.</div>;
  }

  return (
    <div className="pending-cooks">
      {pendingCooks.map(cook => (
        <div key={cook.id} className="pending-card">
          <div className="cook-info">
            <h3>{cook.fullName}</h3>
            <p>📧 {cook.email}</p>
            <p>📅 Registered: {new Date(cook.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="cook-actions">
            <button onClick={() => approveCook(cook.id)} className="approve-btn">✅ Approve</button>
            <button onClick={() => rejectCook(cook.id)} className="reject-btn">❌ Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingCooks;