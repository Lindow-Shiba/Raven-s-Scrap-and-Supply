'use client';

export default function Layout({ children }) {
  return (
    <div style={{ backgroundColor: '#000', color: '#D4AF37', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar will be included in _app.js or page.js */}
      <main style={{ display: 'flex', flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}
