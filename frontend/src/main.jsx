import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductList from "./pages/ProductList.jsx";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login"; 
import AuthLayout from "./layouts/AuthLayout";
import Register from "./pages/Register"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App element={<Home />} />,
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
