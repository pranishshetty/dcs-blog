import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Code } from 'lucide-react';
import dcsLogo from '../assets/dcs_logo.png';

export const Footer = () => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <img
              src={dcsLogo}
              alt="DCS Logo"
              style={{ width: '36px', height: '36px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>DCS Blog</span>
          </Link>
          <p className="footer-desc">
            Empowering students, developers & tech enthusiasts with high-performance application engineering, modern web architectures, and full-stack insights.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Quick Navigation</h4>
          <ul className="footer-nav">
            <li><Link to="/">Home Articles</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Top Categories</h4>
          <ul className="footer-nav">
            <li><Link to="/?category=Application">Application</Link></li>
            <li><Link to="/?category=Data">Data & Cloud</Link></li>
            <li><Link to="/?category=Technology">Technology</Link></li>
            <li><Link to="/?category=Software">Software</Link></li>
            <li><Link to="/?category=Cybersecurity">Cybersecurity</Link></li>
          </ul>
        </div>

        <div className="footer-col developer-col">
          <h4 className="footer-col-title">About DCS</h4>
          <div className="developer-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={dcsLogo}
                alt="Dynamic Computer School"
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Dynamic Computer School</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Computer Education & Training</div>
              </div>
            </div>
            <a
              href="https://dynamicomputerschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="github-dev-btn"
            >
              <ExternalLink size={13} />
              <span>dynamicomputerschool.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} Dynamic Computer School (DCS). Designed & Developed with</span>
          <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
          <span>by</span>
          <a
            href="https://dynamicomputerschool.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 800, color: 'var(--accent-blue)', textDecoration: 'none' }}
          >
            Dynamic Computer School
          </a>
        </div>

        <div className="footer-socials">
          <a
            href="https://api.whatsapp.com/send?text=Check%20out%20DCS%20Blog%20https://blog.dynamicomputerschool.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label="WhatsApp"
            title="Share on WhatsApp"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.994 9.994 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.037-5.176-2.922-7.062A9.927 9.927 0 0012.012 2zm5.835 14.195c-.247.693-1.436 1.327-1.98 1.385-.502.053-1.157.081-3.327-.81-2.775-1.139-4.571-3.957-4.708-4.14-.139-.183-1.116-1.488-1.116-2.838 0-1.35.705-2.013.955-2.263.247-.249.541-.311.723-.311.181 0 .363.003.522.01.171.007.4.015.586.438.192.435.652 1.587.708 1.701.057.114.095.249.019.4-.076.152-.114.248-.227.382-.114.134-.239.299-.341.401-.114.114-.233.238-.101.464.133.227.591.975 1.268 1.579.873.778 1.609 1.019 1.836 1.132.227.114.36.096.495-.057.135-.152.578-.673.733-.903.155-.23.31-.191.522-.114.212.076 1.344.634 1.573.748.229.114.382.172.438.268.057.095.057.553-.19 1.246z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://dynamicomputerschool.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label="Dynamic Computer School"
            title="Dynamic Computer School"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};
