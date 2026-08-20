import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LanguageTranslator } from './components/LanguageTranslator';

import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { PostEditor } from './pages/PostEditor';
import { AnalyticsPage } from './pages/AnalyticsPage';

import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BlogProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <SearchModal />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:slug" element={<ArticleDetail />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/editor"
                    element={
                      <ProtectedRoute>
                        <PostEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/editor/:id"
                    element={
                      <ProtectedRoute>
                        <PostEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <LanguageTranslator isFloating={true} />
              <Footer />
            </div>
          </BrowserRouter>
        </BlogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
