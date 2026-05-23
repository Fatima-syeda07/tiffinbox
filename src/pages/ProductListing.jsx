import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";

const ProductListing = () => {
  const { currentUser, userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cooks, setCooks] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [currentUser, userRole]);

  const fetchProducts = async () => {
    try {
      let productsRef = collection(db, "products");
      let querySnapshot;

      if (userRole === "cook") {
        // Show only products belonging to this cook
        const q = query(productsRef, where("cookId", "==", currentUser.uid));
        querySnapshot = await getDocs(q);
      } else {
        // Customer sees all products
        querySnapshot = await getDocs(productsRef);
      }

      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("🔥 Products from Firestore:", productsData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      // Extract unique cook names
      const uniqueCooks = [...new Set(productsData.map(p => p.cookName))];
      setCooks(uniqueCooks);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = ({ cook, allergen, sort }) => {
    let updated = [...products];

    if (cook) {
      updated = updated.filter(p => p.cookName === cook);
    }
    if (allergen) {
      updated = updated.filter(p => !p.allergens?.includes(allergen));
    }
    if (sort === "lowToHigh") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      updated.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(updated);
  };

  if (loading) return <div className="loading">Loading delicious meals...</div>;

  console.log("filteredProducts length:", filteredProducts.length);

  return (
    <div className="listing-container">
      <div className="listing-header">
        <h1>🍱 All Meal Kits</h1>
        <p>Fresh homemade meals from local cooks</p>
      </div>
      <FilterBar onFilterChange={handleFilterChange} cooks={cooks} />
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">No meals found. Try different filters!</div>
        ) : (
          filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </div>
  );
};

export default ProductListing;