import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import React  from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css'
import './styles/Form.css';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage2';
import { useAuth } from './store/authContext';
import AdminPage from './pages/AdminPage';
import AppRoutes from './routes/routes';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="App">
      <Router>
        <Header />
        <div className="container">
          <AppRoutes />
        </div>
      </Router>
    </div>
  );
}

export default App;
