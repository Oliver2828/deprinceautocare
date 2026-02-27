// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";

export default function App() {
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={role === "owner" ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/inventory" element={role === "owner" ? <Inventory /> : <Navigate to="/" />} />
        <Route path="/reports" element={role === "owner" ? <Reports /> : <Navigate to="/" />} />
        <Route path="/sales" element={role ? <Sales /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}