import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      onLogin(data.token);
    } else {
      const err = await res.json();
      setError(err.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Logga in till WindskoreData</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <input placeholder="Användarnamn" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Logga in</button>
    </form>
  );
}
