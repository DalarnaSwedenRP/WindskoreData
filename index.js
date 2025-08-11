const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'windskore_secret_123456'; // Byt till miljövariabel sen

// Simpel databas mock (skall ersättas med riktig databas)
let users = [];
let files = {};

// --- Hjälpfunktioner ---
function generateToken(user) {
  return jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '12h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- Routes ---

// Registrera användare
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
  files[username] = { '/': {} }; // rotmapp
  res.json({ message: 'User registered' });
});

// Logga in
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token });
});

// Hämta filer i en mapp
app.get('/api/files', authenticateToken, (req, res) => {
  const username = req.user.username;
  const folderPath = req.query.path || '/';
  const folder = getFolder(files[username], folderPath);
  if (!folder) return res.status(404).json({ message: 'Folder not found' });
  res.json(folder);
});

// Hjälpfunktion för att hitta mapp
function getFolder(tree, folderPath) {
  const parts = folderPath.split('/').filter(Boolean);
  let current = tree['/'];
  for (const part of parts) {
    if (!current[part] || typeof current[part] !== 'object') return null;
    current = current[part];
  }
  return current;
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
