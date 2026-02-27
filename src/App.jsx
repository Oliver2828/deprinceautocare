// App.jsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import Inventory from "./pages/Inventory";


import SelectionSection from "./pages/Selection";
import InvenDash from "./components/inventory/InvenDash";

import AddProduct from "./components/inventory/AddProduct";

import Products from "./components/inventory/Products";

export default function App() {
  // the role-based guarded routes were removed per latest requirements

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/options" element={<SelectionSection />} />
       
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/invendash" element={<InvenDash />
}>
          <Route index element={<Products />} />
          <Route path="new-records" element={<AddProduct />} />
          <Route path="product-list" element={<Products />} />
         
          
        </Route>
   
      </Routes>
    </BrowserRouter>
  );
}