import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AnalysisPage from './pages/AnalysisPage';
import ExamplesPage from './pages/ExamplesPage';
import { AuthProvider } from './contexts/AuthContext';

import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="examples" element={<ExamplesPage />} />
              <Route path="analysis/:id" element={<AnalysisPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// Protected route component
const ProtectedRoute = () => {
  const { isAuthenticated } = React.useContext(React.createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    error: null,
    clearError: () => {}
  }));

  // Replace with the actual AuthContext when it's created
  // const { isAuthenticated } = useAuth();

  // For development only - comment this line out when auth is implemented
  const devMode = true;
  
  if (!isAuthenticated && !devMode) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default App;
