import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/user/Home.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductList from "./pages/user/ProductList.jsx";
import Cart from "./pages/user/Cart";
import ProductDetails from "./pages/user/ProductDetails";
import Login from "./pages/auth/Login";
import AuthLayout from "./layouts/AuthLayout";
import Register from "./pages/auth/Register";
import HomeAfterLogin from "./pages/user/HomeAfterLogin";
import Profile from "./pages/user/Profile";
import AdminPanel from "./pages/admin/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductList /> },
      { path: "cart", element: <Cart /> },
      { path: "product/:id", element: <ProductDetails /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/admin", element: <AdminPanel /> },
      { path: "/home", element: <ProtectedRoute><HomeAfterLogin /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);