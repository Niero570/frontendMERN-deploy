// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './content/authContent';

import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import About from './components/About';
import Contacts from './components/Contacts';
import Posts from './components/Posts';
import BattleArenaEnhanced from './components/BattleArenaEnhanced';
import SignupPage from './pages/signup';

function AppContent() {
  const { user, loading, token } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/posts/:post_id" element={<Posts />} />
        <Route path="/battle" element={user ? <BattleArenaEnhanced /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;