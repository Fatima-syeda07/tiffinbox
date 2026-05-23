import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customersWhoOrdered, setCustomersWhoOrdered] = useState([]);
  const { addToCart } = useCart();
  const { userRole } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (userRole === "admin" && product) {
      fetchCustomersWhoOrdered(product.id);
    }
  }, [userRole, product]);

  const fetchCustomersWhoOrdered = async (productId) => {
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const relevant = orders.filter(order => 
        order.items && order.items.some(item => item.id === productId)
      );
      const customers = relevant.map(order => ({
        userId: order.userId,
        name: order.userName || "Unknown",
        orderDate: order.createdAt?.toDate?.() || new Date(order.createdAt),
        quantity: order.items.find(item => item.id === productId)?.quantity || 0,
        total: order.total,
      }));
      setCustomersWhoOrdered(customers);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <div className="loading">Loading meal details...</div>;
  if (!product) return null;

  return (
    <div className="detail-container">
      <div className="detail-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="detail-info">
        <div className="cook-badge">👩‍🍳 {product.cookName}</div>
        <h1>{product.name}</h1>
        <div className="price-large">PKR{product.price}</div>
        <p className="description">{product.description}</p>
        <div className="details-section">
          <h3>📋 Ingredients & Allergens</h3>
          <p>{product.ingredients || "Please contact cook for detailed ingredients."}</p>
          {product.allergens?.length > 0 && (
            <div className="allergen-list">
              <strong>Contains:</strong> {product.allergens.join(", ")}
            </div>
          )}
        </div>
        <div className="details-section">
          <h3>📅 Available on</h3>
          <div className="days">
            {product.availableDays?.map(day => <span key={day} className="day-badge">{day}</span>)}
          </div>
        </div>
        {userRole === "customer" && (
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            🛒 Add to Cart
          </button>
        )}
        {userRole === "admin" && customersWhoOrdered.length > 0 && (
          <div className="details-section">
            <h3>🧑‍🍳 Customers who ordered this meal</h3>
            <div className="customer-orders-list">
              {customersWhoOrdered.map((c, idx) => (
                <div key={idx} className="customer-order-item">
                  <strong>{c.name}</strong> – {c.quantity} item(s) – PKR{c.total} – {c.orderDate.toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;