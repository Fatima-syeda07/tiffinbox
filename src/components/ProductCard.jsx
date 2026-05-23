import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-info">
        <div className="product-cook">👩‍🍳 {product.cookName}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description.substring(0, 80)}...</p>
        <div className="product-footer">
          <span className="product-price">PKR {product.price}</span>
          <Link to={`/product/${product.id}`} className="view-details">View Details →</Link>
        </div>
        {product.allergens?.length > 0 && (
          <div className="allergen-tags">
            {product.allergens.map(a => <span key={a} className="allergen">⚠️ {a}</span>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;