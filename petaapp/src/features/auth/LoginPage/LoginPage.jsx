import React, { useState } from 'react';
import { Map, ArrowRight, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './LoginPage.css';

export default function LoginPage({ onLogin, onBack }) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login states
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw) => {
    if (pw.length < 8 || pw.length > 32) {
      return 'Kata sandi harus terdiri dari 8 hingga 32 karakter.';
    }
    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    if (!hasLetter || !hasNumber || !hasSymbol) {
      return 'Kata sandi harus merupakan kombinasi dari huruf, angka, dan karakter unik/simbol (misal: @, #, $, !, dll.).';
    }
    return null;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        identifier,
        password: loginPassword
      });

      if (response.data.token) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (onLogin) onLogin(response.data.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.error;
      if (errMsg === 'Kredensial tidak valid') {
        setError('Nama pengguna/email atau kata sandi salah. Silakan coba lagi.');
      } else if (!navigator.onLine || err.message?.includes('Network Error')) {
        setError('Koneksi jaringan terputus. Pastikan Anda terhubung ke internet.');
      } else {
        setError(errMsg || 'Gagal masuk ke akun. Terjadi kesalahan pada server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (username.length < 3 || username.length > 20) {
      setError('Nama pengguna harus terdiri dari 3 hingga 20 karakter.');
      setLoading(false);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username)) {
      setError('Nama pengguna hanya boleh mengandung huruf, angka, titik, dan garis bawah (tidak boleh menggunakan karakter unik/simbol lainnya).');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid.');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(registerPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        username,
        email,
        password: registerPassword
      });

      if (response.data.user) {
        setSuccess('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
        // Reset fields
        setUsername('');
        setEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        // Switch to login form
        setTimeout(() => {
          setIsRegistering(false);
          setSuccess('');
        }, 2500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.response?.data?.error;
      if (errMsg === 'Username atau Email sudah terdaftar') {
        setError('Nama pengguna atau email sudah terdaftar.');
      } else if (!navigator.onLine || err.message?.includes('Network Error')) {
        setError('Koneksi jaringan terputus. Gagal melakukan pendaftaran.');
      } else {
        setError(errMsg || 'Gagal mendaftar akun. Terjadi kesalahan pada server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-split-page">
      <div className="login-side-image">
        <div className="image-overlay">
          <div className="branding-content">
            <div className="branding-logo">
              <Map size={40} color="#ffffff" />
            </div>
            <h1>Empower Geo</h1>
            <p>Visualisasi Data Geografis & Potensi Desa Adiwarno secara Presisi dan Terintegrasi.</p>
          </div>
        </div>
      </div>

      <div className="login-side-form">
        <div className="form-container">
          <button type="button" className="login-back-btn" onClick={onBack}>
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </button>
          <div className="login-header">
            <h2>{isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}</h2>
            <p>
              {isRegistering 
                ? 'Lengkapi formulir pendaftaran di bawah ini untuk membuat akun baru Anda.' 
                : 'Silakan masuk ke akun Anda untuk mengelola data geografis.'}
            </p>
          </div>

          {error && (
            <div className="login-error-alert" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="login-success-alert" style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#16a34a',
              padding: '12px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '20px'
            }}>
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          {isRegistering ? (
            <form className="login-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Nama Pengguna</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Masukkan nama pengguna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
                <span className="form-helper-text" style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: '1.4', textAlign: 'left', display: 'block', paddingLeft: '4px' }}>
                  * Terdiri dari 3-20 karakter, hanya boleh huruf, angka, titik (.), dan garis bawah (_).
                </span>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Kata Sandi</label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    placeholder="Masukkan kata sandi baru"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required 
                  />
                </div>
                <span className="form-helper-text" style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: '1.4', textAlign: 'left', display: 'block', paddingLeft: '4px' }}>
                  * Terdiri dari 8-32 karakter, wajib kombinasi dari huruf, angka, dan karakter unik/simbol (seperti @, #, $, !, dll.).
                </span>
              </div>

              <div className="form-group">
                <label>Konfirmasi Kata Sandi</label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email / Nama Pengguna</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="admin@adiwarno.id"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Kata Sandi</label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Ingat saya</span>
                </label>
                <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi administrator sistem untuk mereset kata sandi Anda."); }}>Lupa sandi?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sedang Masuk...' : 'Masuk Sekarang'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          <div className="login-footer">
            {isRegistering ? (
              <>
                Sudah memiliki akun? <a href="#" onClick={toggleMode}>Masuk Sekarang</a>
              </>
            ) : (
              <>
                Belum punya akun? <a href="#" onClick={toggleMode}>Daftar Sekarang</a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
