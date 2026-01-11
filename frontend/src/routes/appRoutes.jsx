import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ResetPassword from "../components/resetpassword";
import Home from "../components/Home";
import About from "../components/About";
import UniversityDetails from "../components/UniversityDetails";
import Menu from "../components/Menu";
import Product from "../components/Product";
import Review from "../components/Review";
import Contact from "../components/Contact";
import Blog from "../components/Blog";
import Checkout from "../components/checkout";
import ProtectedRoute from "./ProtectedRoute";
import Account from "../components/Account";
import AdminDashboard from "../components/AdminDashboard";
import SinglePage from "../components/singlePage";
// New imports for order management
import MyOrders from "../components/MyOrders";
import AdminOrders from "../components/AdminOrders";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* User protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <SinglePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedRoute>
            <Review />
          </ProtectedRoute>
        }
      />
      {/* Admin-only review view without main navbar/footer (different route) */}
      <Route
        path="/admin-reviews"
        element={
          <ProtectedRoute adminOnly>
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        }
      />
      {/* Admin-only blogs view without main navbar/footer (different route) */}
      <Route
        path="/admin-blogs"
        element={
          <ProtectedRoute adminOnly>
            <Blog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      {/* New user route for My Orders */}
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university-details"
        element={
          <ProtectedRoute>
            <UniversityDetails />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* New admin route for Admin Orders */}
      <Route
        path="/admin-orders"
        element={
          <ProtectedRoute adminOnly>
            <AdminOrders />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
