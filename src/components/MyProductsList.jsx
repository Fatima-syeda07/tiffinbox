import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyProductsList = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const q = query(collection(db, "products"), where("cookId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this meal kit?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        setProducts(products.filter((p) => p.id !== productId));
        alert("Product deleted.");
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (loading) return <div className="loading">Loading your meal kits...</div>;

  if (products.length === 0) {
    return (
      <div className="no-products-message">
        <p>You haven't added any meal kits yet.</p>
        <Link to="/seller?tab=addProduct" className="btn-add-first">
          + Add Your First Meal Kit
        </Link>
      </div>
    );
  }

  return (
    <div className="my-products">
      {products.map((product) => (
        <div key={product.id} className="my-product-card">
          <img src={product.imageUrl} alt={product.name} className="product-img" />
          <div className="product-details">
            <h3>{product.name}</h3>
            <p className="product-price">PKR{product.price}</p>
            <p className="product-desc">{product.description.substring(0, 60)}...</p>
            <div className="product-meta">
              <span>📅 {product.availableDays?.join(", ") || "Not set"}</span>
              <span>⚠️ {product.allergens?.join(", ") || "No allergens"}</span>
            </div>
          </div>
          <div className="product-actions">
            <Link to={`/seller/edit/${product.id}`} className="edit-btn">
              Edit
            </Link>
            <button onClick={() => handleDelete(product.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProductsList;