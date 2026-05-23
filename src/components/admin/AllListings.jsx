import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const AllListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Permanently delete this meal kit?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        setProducts(products.filter(p => p.id !== productId));
        alert("Product deleted.");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete product.");
      }
    }
  };

  if (loading) return <div className="loading">Loading all products...</div>;

  if (products.length === 0) return <div className="no-data">No products found.</div>;

  return (
    <div className="all-listings">
      {products.map(product => (
        <div key={product.id} className="listing-card">
          <img src={product.imageUrl} alt={product.name} className="listing-img" />
          <div className="listing-details">
            <h3>{product.name}</h3>
            <p>👩‍🍳 {product.cookName}</p>
            <p>💰 PKR{product.price}</p>
            <p>📅 {product.availableDays?.join(", ") || "No schedule"}</p>
          </div>
          <div className="listing-actions">
            <button onClick={() => deleteProduct(product.id)} className="delete-btn">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllListings;