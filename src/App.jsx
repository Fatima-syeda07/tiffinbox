import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PendingPage from "./pages/PendingPage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AddEditProduct from "./pages/AddEditProduct";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending-approval" element={<PendingPage />} />

            {/* Customer, Cook & Admin can browse products */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["customer", "cook", "admin"]}>
                  <ProductListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute allowedRoles={["customer", "cook", "admin"]}>
                  <ProductListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute allowedRoles={["customer", "cook", "admin"]}>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            {/* Customer only routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />

            {/* Cook routes */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRoles={["cook"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["cook"]}>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />

            {/* Admin route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;