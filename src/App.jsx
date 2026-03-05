// App.jsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import SelectionSection from "./pages/Selection";
import InvenDash from "./components/inventory/InvenDash";
import AddProduct from "./components/inventory/AddProduct";
import Products from "./components/inventory/Products";
import SalesDash from "./components/sales/SalesDash";
import CheckSales from "./components/sales/CheckSales";
import AddDailySales from "./components/sales/AddDailySales";

// simple auth check based on presence of token
function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children ? children : <Outlet />;
}

export default function App() {
  // wrap all protected paths in RequireAuth
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* protected group */}
        <Route element={<RequireAuth />}> 
          <Route path="/options" element={<SelectionSection />} />
          
          <Route path="/invendash" element={<InvenDash />}> 
            <Route index element={<Products />} />
            <Route path="new-records" element={<AddProduct />} />
            <Route path="product-list" element={<Products />} />
          </Route>
          <Route path="/daily-sales" element={<SalesDash />}> 
            <Route index element={<CheckSales />} />
            <Route path="new-sales" element={<AddDailySales />} />
            <Route path="check-sales" element={<CheckSales />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}