import { useLocation } from "react-router-dom";
import "./styles/style.css";
import "./styles/auth.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/appRoutes.jsx";

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/admin-reviews" ||
    location.pathname === "/admin-blogs" ||
    location.pathname === "/account" ||
    location.pathname === "/admin-orders";

  return (
    <>
      {!hideLayout && <Navbar />}
      <AppRoutes />
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
