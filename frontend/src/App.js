import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/employees"
            element={
              <AppLayout>
                <EmployeeListPage />
              </AppLayout>
            }
          />
          <Route
            path="/employees/new"
            element={
              <AppLayout>
                <EmployeeFormPage mode="create" />
              </AppLayout>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <AppLayout>
                <EmployeeDetailsPage />
              </AppLayout>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={
              <AppLayout>
                <EmployeeFormPage mode="edit" />
              </AppLayout>
            }
          />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;