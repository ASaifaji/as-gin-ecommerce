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
import ProtectedRoute from "./components/ProtectedRoute";
import ProductListAfterLogin from "./pages/user/ProductListAfterLogin";
import ProdDetAfterLog from "./pages/user/ProdDetAfterLog";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import OrderDetail from "./pages/user/OrderDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductList /> },
      { path: "product/:id", element: <ProductDetails /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: "/checkout", element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: "/orders", element: <ProtectedRoute><Orders /></ProtectedRoute> },
      { path: "/orders/:id", element: <ProtectedRoute><OrderDetail /></ProtectedRoute> },
      { path: "/productDetailAfterLog/:id", element: <ProdDetAfterLog /> },
      { path: "/productsAfterLogin", element: <ProductListAfterLogin /> },
      { path: "/admin", element: <ProtectedRoute><AdminPanel /></ProtectedRoute> },
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