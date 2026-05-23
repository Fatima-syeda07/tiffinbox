import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

// Cloudinary config – replace with your own
const CLOUD_NAME = "dwtcvphpl";   
const UPLOAD_PRESET = "tiffinbox_preset";

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Pakistani",
    allergens: [],
    availableDays: [],
    imageUrl: "",
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name,
              description: data.description,
              price: data.price,
              category: data.category || "Pakistani",
              allergens: data.allergens || [],
              availableDays: data.availableDays || [],
              imageUrl: data.imageUrl,
            });
            setImagePreview(data.imageUrl);
          }
        } catch (err) {
          console.error(err);
          alert("Could not load product data.");
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAllergenChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      allergens: value ? value.split(",").map((a) => a.trim()) : [],
    });
  };

  const handleDaysChange = (day) => {
    setFormData((prev) => {
      const days = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: days };
    });
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);
    formData.append("folder", "tiffinbox_products");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Cloudinary upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError("");

    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        allergens: formData.allergens,
        availableDays: formData.availableDays,
        imageUrl,
        cookId: currentUser.uid,
        cookName: currentUser.displayName,
        updatedAt: new Date(),
      };

      if (id) {
        await updateDoc(doc(db, "products", id), productData);
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date(),
        });
        alert("Product added successfully!");
      }
      navigate("/seller");
    } catch (error) {
      console.error(error);
      setUploadError(error.message);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="add-product-form">
      <h2>{id ? "Edit Meal Kit" : "Add New Meal Kit"}</h2>
      {uploadError && <div className="error-message">{uploadError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Dish Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" />
        </div>
        <div className="form-group">
          <label>Price (PKR)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="10" />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option>Pakistani</option>
            <option>Chinese</option>
            <option>Fast Food</option>
            <option>Vegetarian</option>
            <option>Dessert</option>
          </select>
        </div>
        <div className="form-group">
          <label>Allergens (comma separated, e.g. dairy, gluten, nuts)</label>
          <input type="text" value={formData.allergens.join(", ")} onChange={handleAllergenChange} placeholder="e.g. dairy, gluten" />
        </div>
        <div className="form-group">
          <label>Available Days</label>
          <div className="days-checkboxes">
            {weekDays.map((day) => (
              <label key={day} className="day-checkbox">
                <input type="checkbox" checked={formData.availableDays.includes(day)} onChange={() => handleDaysChange(day)} />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Saving..." : id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddEditProduct;