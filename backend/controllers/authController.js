const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const cleanIdentifier = (identifier || '').trim();
    const userQuery = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)',
      [cleanIdentifier, cleanIdentifier]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Kredensial tidak valid' });
    }

    const user = userQuery.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Kredensial tidak valid' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanUsername) {
      return res.status(400).json({ error: 'Nama pengguna tidak boleh kosong' });
    }

    const checkUser = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)',
      [cleanEmail, cleanUsername]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username atau Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [cleanUsername, cleanEmail, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
};
