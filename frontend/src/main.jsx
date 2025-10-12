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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App element={<Home />} />,
  },
  {
    path: "/home",
    element: <App element={<HomeAfterLogin />} />,
  },
  {
    path: "/profile",
    element: <AuthLayout element={<Profile />} />,
  },
  {
    path: "/products",
    element: <App element={<ProductList />} />,
  },
  {
    path: "/cart",
    element: <App element={<Cart />} />,
  },
  {
    path: "/product/:id",
    element: <App element={<ProductDetails />} />,
  },
  {
    path: "/login",
    element: <AuthLayout element={<Login />} />, 
  },
  {
  path: "/register",
  element: <AuthLayout element={<Register />} />,
  },
  {
  path: "/admin",
  element: <App element ={<AdminPanel />} />,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
