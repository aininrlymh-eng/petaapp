import React, { useState, useEffect } from 'react';
import { MapPin, Droplets, Grid, FileText, ArrowRight, BookOpen, Shield } from 'lucide-react';
import './BerandaPage.css';

export default function BerandaPage({ onPageChange, isLoggedIn }) {
  const [stats, setStats] = useState({
    totalRivers: 0,
    totalSawah: 0,
    riverLength: 0,
    sawahArea: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/dataMap/sungefay.geojson').then(res => res.json()).catch(() => null),
      fetch('/dataMap/sawah_semua_blok.geojson').then(res => res.json()).catch(() => null)
    ]).then(([rivers, sawah]) => {
      const riverCount = rivers ? rivers.features.length : 0;
      const sawahCount = sawah ? sawah.features.length : 0;
      
      let totalLength = 0;
      if (rivers) {
        rivers.features.forEach(f => {
          if (f.properties.SHAPE_Leng) totalLength += f.properties.SHAPE_Leng;
        });
      }

      let totalAreaM2 = 0;
      if (sawah) {
        sawah.features.forEach(f => {
          if (f.properties.PopupInfo) {
            const areaStr = f.properties.PopupInfo.split(' ')[0];
            const areaVal = parseFloat(areaStr.replace(',', '.'));
            if (!isNaN(areaVal)) totalAreaM2 += areaVal;
          }
        });
      }

      setStats({
        totalRivers: riverCount,
        totalSawah: sawahCount,
        riverLength: (totalLength * 111).toFixed(1),
        sawahArea: (totalAreaM2 / 10000).toFixed(1)
      });
    });
  }, []);

  return (
    <div className="beranda-page">
      {/* Hero Section */}
      <section className="beranda-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Portal Desa Adiwarno</div>
          <h1>Sistem Informasi Geografis & Laporan Lingkungan</h1>
          <p>
            Platform digital interaktif pemetaan wilayah pertanian sawah, 
            pemantauan jaringan irigasi sungai, serta wadah pelaporan masalah lingkungan secara partisipatif demi kemajuan Desa Adiwarno.
          </p>
          <div className="hero-actions">
            <button className="cta-btn primary" onClick={() => onPageChange('sawah')}>
              Jelajahi Peta Sawah <ArrowRight size={18} />
            </button>
            <button className="cta-btn secondary" onClick={() => onPageChange('sungai')}>
              Direktori Sungai
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="beranda-stats">
        <div className="stats-container">
          <div className="section-header">
            <h2>Ringkasan Data Geografis</h2>
            <p>Informasi luas wilayah pertanian dan segmen perairan desa secara realtime.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card-premium">
              <div className="stat-icon-wrapper sawah">
                <Grid size={24} />
              </div>
              <div className="stat-details">
                <h3>{stats.sawahArea} <span className="unit">Ha</span></h3>
                <span className="stat-label">Total Luas Area Sawah</span>
                <p className="stat-desc">Terbagi dalam beberapa blok pertanian utama warga desa.</p>
              </div>
            </div>

            <div className="stat-card-premium">
              <div className="stat-icon-wrapper sungai">
                <Droplets size={24} />
              </div>
              <div className="stat-details">
                <h3>{stats.riverLength} <span className="unit">KM</span></h3>
                <span className="stat-label">Estimasi Panjang Sungai</span>
                <p className="stat-desc font-medium">Jaringan aliran air irigasi yang melintasi wilayah desa.</p>
              </div>
            </div>

            <div className="stat-card-premium">
              <div className="stat-icon-wrapper segments">
                <MapPin size={24} />
              </div>
              <div className="stat-details">
                <h3>{stats.totalSawah + stats.totalRivers} <span className="unit">Unit</span></h3>
                <span className="stat-label">Total Segmen Terpetakan</span>
                <p className="stat-desc">Jumlah total batas sawah dan segmen sungai yang terdigitalisasi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="beranda-features">
        <div className="features-container">
          <div className="section-header">
            <h2>Fitur Layanan Portal</h2>
            <p>Jelajahi berbagai modul pemetaan dan layanan pelaporan yang tersedia.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card" onClick={() => onPageChange('sawah')}>
              <div className="feature-icon sawah"><Grid size={28} /></div>
              <h3>Peta Blok Sawah</h3>
              <p>Visualisasi pemetaan area persawahan Desa Adiwarno berdasarkan blok. Ketahui luas area dan detail informasi di tiap bloknya.</p>
              <span className="feature-link">Buka Peta Sawah <ArrowRight size={16} /></span>
            </div>

            <div className="feature-card" onClick={() => onPageChange('sungai')}>
              <div className="feature-icon sungai"><Droplets size={28} /></div>
              <h3>Jalur Aliran Sungai</h3>
              <p>Pemantauan aliran sungai dan irigasi penting. Dilengkapi detail panjang segmen perairan untuk kebutuhan irigasi tani.</p>
              <span className="feature-link">Buka Peta Sungai <ArrowRight size={16} /></span>
            </div>

            <div className="feature-card" onClick={() => onPageChange(isLoggedIn ? 'laporan' : 'sawah')}>
              <div className="feature-icon laporan"><FileText size={28} /></div>
              <h3>Laporan Lingkungan</h3>
              <p>Laporkan masalah lingkungan seperti saluran irigasi rusak, pembuangan limbah, atau sampah liar di sekitar persawahan/sungai.</p>
              <span className="feature-link">Buat Laporan Baru <ArrowRight size={16} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines/How-to Section */}
      <section className="beranda-guide">
        <div className="guide-container">
          <div className="guide-left">
            <div className="guide-badge"><BookOpen size={16} /> Panduan Sistem</div>
            <h2>Bagaimana Cara Menggunakan Portal Ini?</h2>
            <p>Ikuti langkah mudah berikut untuk berpartisipasi aktif dalam memetakan dan menjaga lingkungan desa kita.</p>
            <div className="guide-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Jelajahi Peta</h4>
                  <p>Buka menu Direktori Sawah atau Sungai untuk melihat visualisasi spasial wilayah desa secara real-time.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Masuk / Daftar Akun</h4>
                  <p>Lakukan pendaftaran atau login terlebih dahulu jika ingin membuat pengaduan atau laporan kerusakan lingkungan.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Kirim Laporan Pengaduan</h4>
                  <p>Isi formulir laporan, tentukan tingkat urgensi, sertakan lokasi spesifik, dan unggah foto kondisi di lapangan.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Pantau Tindak Lanjut</h4>
                  <p>Lihat status penanganan laporan Anda secara transparan di menu Riwayat Laporan.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="guide-right">
            <div className="info-box-glass">
              <div className="info-icon"><Shield size={32} /></div>
              <h3>Komitmen Keamanan & Transparansi</h3>
              <p>
                Setiap laporan yang dikirimkan warga akan divalidasi oleh Administrator Desa dan ditindaklanjuti secara terbuka demi kelestarian ekosistem pertanian Desa Adiwarno.
              </p>
              <div className="info-stats">
                <div className="info-stat-item">
                  <strong>Respons Cepat</strong>
                  <span>Prioritas Penanganan</span>
                </div>
                <div className="info-stat-item">
                  <strong>Kolaboratif</strong>
                  <span>Untuk Semua Warga</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
