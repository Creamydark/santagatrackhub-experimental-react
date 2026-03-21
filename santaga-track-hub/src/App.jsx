import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout"; // sidebar + Outlet
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Health from "./pages/Health";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register"; // <-- Import the Register component

const RoleRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role")?.toLowerCase();
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- Add this route */}
        {/* Protected Routes wrapped with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout /> {/* Sidebar stays visible */}
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="health" element={<Health />} />
          <Route path="qrcodes" element={<Health />} />
          <Route path="users" element={
            <RoleRoute allowedRoles={['admin']}><Users /></RoleRoute>
          } />
          <Route path="settings" element={
            <RoleRoute allowedRoles={['admin']}><Settings /></RoleRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;