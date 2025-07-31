'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/* ════════ Password Gate Component ════════ */
function DatabaseGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');

  const checkPassword = () => {
    if (input === 'yourpassword') setUnlocked(true); // 🔑 Change 'yourpassword'
    else alert('Incorrect password');
  };

  if (!unlocked) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter Admin Password</h2>
        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <button onClick={checkPassword} style={{ padding: '8px 12px' }}>
          Submit
        </button>
      </div>
    );
  }

  return children;
}

/* ════════ Inventory Data ════════ */
const catalogue = {
  'Car Internals': [
    'Axle Parts', 'Body Repair Tools', 'Brake Pads', 'Clutch Kits', 'Fuel Straps',
    'Radiator Part', 'Suspension Parts', 'Tire Repair Kit', 'Transmission Parts', 'Wires'
  ],
  Materials: [
    'Aluminium', 'Battery', 'Carbon', 'Clutch Fluid', 'Coil Spring', 'Copper',
    'Copper Wires', 'Electronics', 'Graphite', 'Iron', 'Laminated Plastic', 'Lead',
    'Multi-Purpose Grease', 'Paint Thinner', 'Plastic', 'Polymer', 'Polyethylene',
    'Rubber', 'Rusted Metal', 'Scrap Metal', 'Silicone', 'Stainless Steel', 'Steel',
    'Timing Belt', 'Gun Powder', 'Iron Ore'
  ],
  'Extra Items': [
    'Apple Phone', 'Adv Lockpick', 'Bottle Cap', 'Deformed Nail', 'Empty Bottle Glass',
    'Horse Shoe', 'Leather', 'Lockpick', 'Old Coin', 'Pork & Beans', 'Repair Kit',
    'Rusted Lighter', 'Rusted Tin Can', 'Rusted Watch', 'Samsung Phone', 'Recycle Part'
  ]
};

/* ════════ Main Component ════════ */
export default function Home() {
  const [page, setPage] = useState('materials');
  const [cart, setCart] = useState({});
  const [employees, setEmployees] = useState([]);
  const [who, setWho] = useState('');
  const [wh, setWh] = useState('');
  const [inv, setInv] = useState('');
  const [notes, setNotes] = useState('');

  const todayUS = () => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
  };

  useEffect(() => {
    setInv(`${todayUS()}-001`);
    supabase.from('employees').select('*').order('name')
      .then(({ data }) => setEmployees(data || []));
  }, []);

  const add = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const del = id => setCart(({ [id]: _, ...rest }) => rest);
  const setQty = (id, q) => setCart(c => (q > 0 ? { ...c, [id]: q } : { ...c, [id]: undefined }));

  const uploadInvoice = async () => {
    const cartEntries = Object.entries(cart).filter(([, q]) => q > 0);
    const summary = cartEntries.map(([item, q]) => `• **${item}** × ${q}`).join('\n') || 'No items';

    fetch('https://discord.com/api/webhooks/your-webhook-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Raven Invoices',
        embeds: [{
          title: `Invoice ${inv}`,
          color: 0xd1b07b,
          fields: [
            { name: 'Employee', value: who || '—', inline: true },
            { name: 'Warehouse', value: wh || '—', inline: true },
            {
              name: 'Date',
              value: new Date().toLocaleString('en-US', {
                timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short'
              }),
              inline: false
            },
            { name: 'Items', value: summary, inline: false }
          ]
        }]
      })
    });
  };

  const nav = active => ({
    padding: '6px 12px',
    background: active ? '#d1b07b' : 'transparent',
    color: active ? '#000' : '#d1b07b',
    border: '1px solid #d1b07b',
    cursor: 'pointer'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 16px', background: '#111', borderBottom: '1px solid #333'
      }}>
        <Image src="/raven-logo.png" alt="logo" width={60} height={60} />
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Raven's Scrap & Supply</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={nav(page === 'materials')} onClick={() => setPage('materials')}>Materials</button>
          <button style={nav(page === 'database')} onClick={() => setPage('database')}>Database</button>
        </div>
      </header>

      {/* Materials Page */}
      {page === 'materials' && (
        <div style={{ flex: 1, display: 'flex' }}>
          <section id="left-panel" style={{
            flex: '1 0 320px', borderRight: '1px solid #d1b07b',
            padding: 16, display: 'flex', flexDirection: 'column'
          }}>
            <h2>Receipt</h2>
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead><tr>
                <th style={{ textAlign: 'left' }}>Item</th>
                <th style={{ textAlign: 'center', width: 60 }}>Qty</th>
                <th style={{ width: 30 }}></th>
              </tr></thead>
              <tbody>
                {Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td style={{ width: 60 }}>
                      <input type="number" min="0" value={q} style={{ width: 60 }}
                        onChange={e => setQty(id, parseInt(e.target.value || 0))} />
                    </td>
                    <td><button onClick={() => del(id)}><Trash2 size={14} color="white" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ flex: 1 }} />
            <footer style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <select value={who} onChange={e => setWho(e.target.value)} style={{ padding: 8 }}>
                <option value="">Select your Name</option>
                {employees.map(e => <option key={e.id}>{e.name}</option>)}
              </select>
              <select value={wh} onChange={e => setWh(e.target.value)} style={{ padding: 8 }}>
                <option value="">Select Warehouse</option>
                <option>Benny's</option><option>CNC</option>
              </select>
              <input value={inv} onChange={e => setInv(e.target.value)} style={{ padding: 8 }} />
              <input placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} style={{ padding: 8 }} />
              <button onClick={uploadInvoice} style={{
                padding: 10, background: '#d1b07b', color: '#000',
                border: 'none', fontWeight: 600
              }}>Upload Invoice</button>
            </footer>
          </section>

          <section style={{ flex: 2, padding: 16 }}>
            {Object.entries(catalogue).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 24 }}>
                <h2>{cat}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {items.map(it => (
                    <button key={it} onClick={() => add(it)} style={{
                      padding: 8, background: '#d1b07b', color: '#000',
                      border: 'none', borderRadius: 4
                    }}>{it}</button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* Database Page */}
      {page === 'database' && (
        <DatabaseGate>
          <div style={{ padding: 20 }}>
            <h2>Database Access Granted</h2>
            <p>This is where you can build your admin dashboard.</p>
          </div>
        </DatabaseGate>
      )}
    </div>
  );
}
