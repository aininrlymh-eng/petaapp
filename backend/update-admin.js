const db = require('./config/db');
const bcrypt = require('bcrypt');

const updateAdmin = async () => {
  try {
    console.log('Mengupdate password admin di database...');
    const hashedPassword = await bcrypt.hash('admin_123!', 10);
    
    const result = await db.query(
      "UPDATE users SET password = $1 WHERE username = 'admin' RETURNING id, username, email",
      [hashedPassword]
    );
    
    if (result.rows.length > 0) {
      console.log('Password admin berhasil diupdate menjadi: admin_123!');
    } else {
      console.log('User admin tidak ditemukan. Membuat akun admin baru...');
      await db.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
        ['admin', 'admin@adiwarno.id', hashedPassword, 'admin']
      );
      console.log('Akun admin baru berhasil dibuat dengan password: admin_123!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    process.exit(1);
  }
};

updateAdmin();
