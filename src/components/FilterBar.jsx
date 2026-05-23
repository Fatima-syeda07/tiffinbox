import { useState } from "react";

const FilterBar = ({ onFilterChange, cooks }) => {
  const [selectedCook, setSelectedCook] = useState("");
  const [selectedAllergen, setSelectedAllergen] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleCookChange = (e) => {
    const val = e.target.value;
    setSelectedCook(val);
    onFilterChange({ cook: val, allergen: selectedAllergen, sort: sortBy });
  };

  const handleAllergenChange = (e) => {
    const val = e.target.value;
    setSelectedAllergen(val);
    onFilterChange({ cook: selectedCook, allergen: val, sort: sortBy });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    onFilterChange({ cook: selectedCook, allergen: selectedAllergen, sort: val });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>👨‍🍳 Filter by Cook</label>
        <select value={selectedCook} onChange={handleCookChange}>
          <option value="">All Cooks</option>
          {cooks.map((cook) => (
            <option key={cook} value={cook}>
              {cook}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>🚫 Allergen Free</label>
        <select value={selectedAllergen} onChange={handleAllergenChange}>
          <option value="">None</option>
          <option value="dairy">Dairy-Free</option>
          <option value="nuts">Nut-Free</option>
          <option value="gluten">Gluten-Free</option>
        </select>
      </div>
      <div className="filter-group">
        <label>💰 Sort by Price</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="">Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;