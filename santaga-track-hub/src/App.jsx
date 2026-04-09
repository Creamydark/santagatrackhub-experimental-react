import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Health from "./pages/Health";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="health" element={<Health />} />
          <Route path="qrcodes" element={<Health />} />
          
          <Route 
            path="settings" 
            element={<Settings />} 
          />
          
          <Route 
            path="users" 
            element={<RoleRoute allowedRoles={['admin', 'official']}><Users /></RoleRoute>} 
          />
        </Route> {/* Correctly closes the Layout/Protected branch */}
      </Routes> 
    </Router> // Correctly closes the Router at the very end
  );
}

export default App;