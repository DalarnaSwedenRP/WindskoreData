import React, { useState } from 'react';
import Login from './Login';
import Desktop from './Desktop';

function App() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <Desktop token={token} onLogout={() => setToken(null)} />;
}

export default App;
