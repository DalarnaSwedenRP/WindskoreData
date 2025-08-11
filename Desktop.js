import React, { useEffect, useState } from 'react';

export default function Desktop({ token, onLogout }) {
  const [files, setFiles] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/files', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setFiles);
  }, [token]);

  return (
    <div>
      <h1>Välkommen till WindskoreData</h1>
      <button onClick={onLogout}>Logga ut</button>
      <pre>{JSON.stringify(files, null, 2)}</pre>
      {/* Här bygger vi sedan fönsterhantering och filhantering */}
    </div>
  );
}
