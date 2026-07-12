import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

export default function Header({ activePage, onPageChange, onLoginClick, isLoggedIn, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    onLoginClick();
    setIsMenuOpen(false);
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h1
          className="header-logo-btn"
          onClick={() => handleNavClick('beranda')}
          style={{ cursor: 'pointer' }}
        >
          Empower Geo
        </h1>
      </div>

      <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`header-menu-container ${isMenuOpen ? 'open' : ''}`}>
        <nav className="header-nav">
          <button
            className={`h-nav-item ${activePage === 'beranda' ? 'active' : ''}`}
            onClick={() => handleNavClick('beranda')}
          >
            Beranda
          </button>
          <button
            className={`h-nav-item ${activePage === 'sungai' ? 'active' : ''}`}
            onClick={() => handleNavClick('sungai')}
          >
            Direktori Sungai
          </button>
          <button
            className={`h-nav-item ${activePage === 'sawah' ? 'active' : ''}`}
            onClick={() => handleNavClick('sawah')}
          >
            Direktori Sawah
          </button>
          {isLoggedIn && (
            <>
              <button
                className={`h-nav-item ${activePage === 'laporan' ? 'active' : ''}`}
                onClick={() => handleNavClick('laporan')}
              >
                Laporan Lingkungan
              </button>
              <button
                className={`h-nav-item ${activePage === 'riwayat' || activePage === 'detail' ? 'active' : ''}`}
                onClick={() => handleNavClick('riwayat')}
              >
                {user?.role === 'admin' ? 'Riwayat & Detail' : 'Riwayat Laporan'}
              </button>
              {user?.role === 'admin' && (
                <button
                  className={`h-nav-item ${activePage === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavClick('admin')}
                >
                  Panel Admin
                </button>
              )}
            </>
          )}
        </nav>
        <div className="header-right-mobile">
          <button className="login-btn" onClick={handleLoginClick}>
            {isLoggedIn ? 'Keluar' : 'Masuk'}
          </button>
        </div>
      </div>
    </header>
  );
}
