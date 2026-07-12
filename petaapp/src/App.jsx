import { useState, useEffect } from 'react';
import Header from './features/layout/Header/Header';
import LeftSidebar from './features/map/LeftSidebar/LeftSidebar';
import RightSidebar from './features/map/RightSidebar/RightSidebar';
import MapComponent from './features/map/MapComponent/MapComponent';
import LaporanPage from './features/reports/LaporanPage/LaporanPage';
import RiwayatPage from './features/reports/RiwayatPage/RiwayatPage';
import LoginPage from './features/auth/LoginPage/LoginPage';
import AdminDashboard from './features/admin/AdminDashboard/AdminDashboard';
import DetailLaporanPage from './features/reports/DetailLaporanPage/DetailLaporanPage';
import BerandaPage from './features/home/BerandaPage/BerandaPage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('beranda');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const handlePageChange = (page) => {
    setSelectedReport(null);
    setActivePage(page);
  };

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowLogin(false);
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    const layout = document.querySelector('.dashboard-layout');
    if (layout) {
      layout.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    handlePageChange('beranda');
  };

  const renderContent = () => {
    if (showLogin) {
      return <LoginPage onLogin={handleLoginSuccess} onBack={() => setShowLogin(false)} />;
    }

    switch (activePage) {
      case 'beranda':
        return <BerandaPage onPageChange={handlePageChange} isLoggedIn={isLoggedIn} />;
      case 'sungai':
        return (
          <div className={`dashboard-layout ${showLeftSidebar ? 'left-open' : 'left-closed'} ${showRightSidebar ? 'right-open' : 'right-closed'}`}>
            <LeftSidebar activeDataType="sungai" />
            <main className="main-content" style={{ position: 'relative' }}>
              <button 
                className="sidebar-toggle-btn left-toggle"
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                title={showLeftSidebar ? "Tutup Sidebar Kiri" : "Buka Sidebar Kiri"}
              >
                {showLeftSidebar ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>

              <MapComponent activeDataType="sungai" zoomToFeature={selectedFeature} />
            </main>
            <RightSidebar activeDataType="sungai" onFeatureClick={handleFeatureClick} />
          </div>
        );
      case 'sawah':
        return (
          <div className={`dashboard-layout ${showLeftSidebar ? 'left-open' : 'left-closed'} ${showRightSidebar ? 'right-open' : 'right-closed'}`}>
            <LeftSidebar activeDataType="sawah" />
            <main className="main-content" style={{ position: 'relative' }}>
              <button 
                className="sidebar-toggle-btn left-toggle"
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                title={showLeftSidebar ? "Tutup Sidebar Kiri" : "Buka Sidebar Kiri"}
              >
                {showLeftSidebar ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>

              <MapComponent activeDataType="sawah" zoomToFeature={selectedFeature} />
            </main>
            <RightSidebar activeDataType="sawah" onFeatureClick={handleFeatureClick} />
          </div>
        );
      case 'laporan':
        return <LaporanPage />;
      case 'riwayat':
        if (selectedReport) {
          return (
            <DetailLaporanPage 
              report={selectedReport} 
              onBack={() => setSelectedReport(null)} 
              user={user} 
            />
          );
        }
        return <RiwayatPage user={user} onViewDetail={setSelectedReport} />;
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} onBack={() => setActivePage('beranda')} />;
      default:
        return <MapComponent activeDataType="sawah" />;
    }
  };

  return (
    <div className="app-container">
      {!showLogin && activePage !== 'admin' && (
        <Header 
          activePage={activePage} 
          onPageChange={handlePageChange} 
          onLoginClick={isLoggedIn ? handleLogout : () => setShowLogin(true)}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
