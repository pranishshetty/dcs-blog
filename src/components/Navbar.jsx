import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, LogOut, BarChart2, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import dcsLogo from '../assets/dcs_logo.png';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { setIsSearchOpen } = useBlog();
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Secret portal trigger logic: 3 clicks on logo badge
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  const handleSecretLogoClick = (e) => {
    if (isAdmin) return;
    setClickCount((prev) => prev + 1);

    if (clickTimer) clearTimeout(clickTimer);

    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1500);
    setClickTimer(timer);

    if (clickCount + 1 >= 3) {
      setClickCount(0);
      navigate('/admin/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src={dcsLogo}
            alt="DCS Logo"
            onClick={handleSecretLogoClick}
            title={isAdmin ? 'DCS Admin' : 'DCS'}
            style={{ width: '40px', height: '40px', objectFit: 'contain', cursor: 'pointer', userSelect: 'none' }}
          />
          <Link to="/" className="brand-logo" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            DCS
          </Link>
        </div>

        {/* Admin & Analytics Links (Only visible when logged in as Admin) */}
        {isAdmin && (
          <ul className="nav-links">
            <li>
              <Link
                to="/admin"
                className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                style={{ color: 'var(--accent-blue)', fontWeight: 700 }}
              >
                <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
                CMS Admin
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
                style={{ color: 'var(--accent-purple)', fontWeight: 700 }}
              >
                <BarChart2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Analytics
              </Link>
            </li>
          </ul>
        )}

        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={() => setIsSearchOpen(true)}
            title="Search blog posts"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Theme Day / Night Switch */}
          <div
            className="theme-switch"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            role="button"
            tabIndex={0}
          >
            <div className="theme-switch-thumb">
              {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
            </div>
          </div>

          <a
            href="https://github.com/pranishshetty"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
          >
            Github
          </a>

          {/* Logout button ONLY shown if admin is logged in */}
          {isAdmin && (
            <button
              onClick={logout}
              className="admin-link-btn"
              style={{ backgroundColor: '#ef4444', gap: '0.3rem' }}
              title="Logout from Admin"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
