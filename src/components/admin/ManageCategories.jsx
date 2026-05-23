import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      if (snapshot.empty) {
        // Seed default categories if none exist
        const defaults = ["Pakistani", "Chinese", "Fast Food", "Vegetarian", "Dessert", "BBQ", "Seafood"];
        for (let cat of defaults) {
          await addDoc(collection(db, "categories"), { name: cat });
        }
        // Refetch
        const newSnapshot = await getDocs(collection(db, "categories"));
        setCategories(newSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      } else {
        setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "categories"), { name: newCategory.trim() });
      setCategories([...categories, { id: docRef.id, name: newCategory.trim() }]);
      setNewCategory("");
    } catch (error) {
      console.error("Add category failed:", error);
      alert("Failed to add category.");
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Delete this category? Products using it won't be affected.")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete category.");
      }
    }
  };

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="manage-categories">
      <form onSubmit={addCategory} className="add-category-form">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit">+ Add Category</button>
      </form>
      <div className="categories-list">
        {categories.map(cat => (
          <div key={cat.id} className="category-item">
            <span>{cat.name}</span>
            <button onClick={() => deleteCategory(cat.id)} className="delete-cat-btn">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;