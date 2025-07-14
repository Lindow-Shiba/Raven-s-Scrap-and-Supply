// app/page.js
'use client';

import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/* ══════════════ CONFIG ══════════════ */
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1394330571257417770/2xNNVkVVs-5yivGIxFnVhaI6j9VKwhzjZ0Z8nn_TJ_q5VFJUHgQldmI30CJtdJt7bk_0'; // ← replace

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
    'Rusted Lighter', 'Rusted Tin Can', 'Rusted Watch', 'Samsung Phone'
  ]
};

/* ═════════ MAIN COMPONENT ═════════ */
export default function Home() {
  const [page, setPage] = useState('materials');
  const [cart, setCart] = useState({});
  const [employees, setEmployees] = useState([]);

  const [who, setWho] = useState('');
  const [wh, setWh] = useState('');

  const todayUS = () => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
  };
  const [inv, setInv] = useState(`${todayUS()}-001`);
  const [notes, setNotes] = useState('');

  /* fetch employees */
  const loadEmployees = () =>
    supabase.from('employees').select('*').order('name')
      .then(({ data }) => setEmployees(data || []));

  useEffect(loadEmployees, []);

  /* cart helpers */
  const add = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const del = id => setCart(({ [id]: _, ...rest }) => rest);
  const setQty = (id, q) => setCart(c => (q > 0 ? { ...c, [id]: q } : { ...c, [id]: undefined }));

  /* upload invoice */
  const uploadInvoice = async () => {
    const el = document.getElementById('left-panel');
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${inv}.png`;
    link.click();

    const cartEntries = Object.entries(cart).filter(([, q]) => q > 0);
    const summary =
      cartEntries.map(([item, q]) => `• **${item}** × ${q}`).join('\n') || 'No items';

    let totalValue = 0;
    if (cartEntries.length) {
      const { data: prices } = await supabase.from('materials').select('name, price');
      for (const [name, qty] of cartEntries) {
        const row = prices.find(p => p.name === name);
        if (row) totalValue += row.price * qty;
      }
    }

    const emp = employees.find(e => e.name === who);
    const commissionPct = emp && emp.commission != null ? emp.commission : 100;
    const employeePay = Math.round(totalValue * (commissionPct / 100));

    fetch(DISCORD_WEBHOOK, {
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
            { name: 'Items', value: summary, inline: false },
            { name: 'Total Price', value: `$${totalValue.toLocaleString()}`, inline: false },
            { name: 'Employee Pay', value: `$${employeePay.toLocaleString()}`, inline: false }
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

  /* ───────── render ───────── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 16px', background: '#111', borderBottom: '1px solid #333'
      }}>
        <Image src="/raven-logo.png" alt="logo" width={60} height={60} />
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Raven&apos;s Scrap &amp; Supply</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={nav(page === 'materials')} onClick={() => setPage('materials')}>Materials</button>
          <button style={nav(page === 'database')} onClick={() => setPage('database')}>Database</button>
        </div>
      </header>

      {/* materials page */}
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
                <option>Benny&apos;s</option><option>CNC</option>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {items.map(it => (
                    <button key={it} onClick={() => add(it)} style={{
                      padding: 8, background: '#d1b07b', color: '#000',
                      border: 'none', borderRadius: 4, fontSize: 12
                    }}>{it}</button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* database page */}
      {page === 'database' && (
        <DatabaseGate>
          <DatabasePage refresh={loadEmployees} />
        </DatabaseGate>
      )}
    </div>
  );
}

/* ════════ Database Gate ════════ */
function DatabaseGate({ children }) {
  const [allowed, setAllowed] = useState(false);
  const [pw, setPw] = useState('');
  if (allowed) return children;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', gap: 16
    }}>
      <h2>Enter Admin Password</h2>
      <input type="password" value={pw} onChange={e => setPw(e.target.value)}
        placeholder="Password…" style={{ padding: 8 }} />
      <button onClick={() => pw === 'RavenAdmin' ? setAllowed(true) : alert('Incorrect')}
        style={{ padding: '6px 18px', background: '#d1b07b', border: 'none', color: '#000' }}>
        Unlock
      </button>
    </div>
  );
}

/* ════════ Database Page ════════ */
function DatabasePage({ refresh }) {
  const [employees, setEmployees] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [name, setName] = useState('');
  const [cid, setCid] = useState('');
  const [commission, setCommission] = useState('');

  const loadEmployees = () =>
    supabase.from('employees').select('*').order('id', { ascending: false })
      .then(({ data }) => setEmployees(data || []));

  const loadMaterials = () =>
    supabase.from('materials').select('*').order('name')
      .then(({ data }) => setMaterials(data || []));

  useEffect(() => { loadEmployees(); loadMaterials(); }, []);

  const addEmployee = async () => {
    if (!name || !cid) return;
    await supabase.from('employees').insert({
      name, cid, commission: commission ? Number(commission) : 100
    });
    setName(''); setCid(''); setCommission('');
    loadEmployees(); refresh();
  };

  const updEmployee = async (id, field, val) => {
    await supabase.from('employees').update({ [field]: val }).eq('id', id);
    loadEmployees(); refresh();
  };
  const delEmployee = async id => {
    await supabase.from('employees').delete().eq('id', id);
    loadEmployees(); refresh();
  };

  const updPrice = async (id, price) => {
    await supabase.from('materials').update({ price }).eq('id', id);
    loadMaterials();
  };

  return (
    <main style={{ padding: 16, flex: 1 }}>
      {/* employees */}
      <h2>Employees</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)}
          style={{ padding: 6, width: 180 }} />
        <input placeholder="CID" value={cid} onChange={e => setCid(e.target.value)}
          style={{ padding: 6, width: 120 }} />
        <input type="number" placeholder="Commission %" min="0" max="100"
          value={commission} onChange={e => setCommission(e.target.value)}
          style={{ padding: 6, width: 120 }} />
        <button onClick={addEmployee} style={{
          padding: '6px 12px', background: '#d1b07b', border: 'none', color: '#000'
        }}>Add</button>
      </div>

      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left',   width: 180 }}>Name</th>
            <th style={{ textAlign: 'center', width: 120 }}>CID</th>
            <th style={{ textAlign: 'center', width: 120 }}>Comm&nbsp;%</th>
            <th style={{ width: 30 }}></th>{/* blank header for delete */}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td style={{ width: 180 }}>
                <input value={emp.name}
                  onChange={e => {
                    const v = e.target.value;
                    setEmployees(employees.map(x => x.id === emp.id ? { ...x, name: v } : x));
                    updEmployee(emp.id, 'name', v);
                  }}
                  style={{ padding: 4, width: 180 }} />
              </td>
              <td style={{ width: 120 }}>
                <input value={emp.cid}
                  onChange={e => {
                    const v = e.target.value;
                    setEmployees(employees.map(x => x.id === emp.id ? { ...x, cid: v } : x));
                    updEmployee(emp.id, 'cid', v);
                  }}
                  style={{ padding: 4, width: 120 }} />
              </td>
              <td style={{ width: 120 }}>
                <input type="number" min="0" max="100" value={emp.commission ?? 100}
                  onChange={e => {
                    const v = Number(e.target.value || 0);
                    setEmployees(employees.map(x => x.id === emp.id ? { ...x, commission: v } : x));
                    updEmployee(emp.id, 'commission', v);
                  }}
                  style={{ padding: 4, width: 120 }} />
              </td>
              <td style={{ width: 30 }}>
                <button onClick={() => delEmployee(emp.id)} style={{
                  background: 'red', color: '#fff', border: 'none', padding: '4px 8px'
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* materials */}
      <h2 style={{ marginTop: 40 }}>Materials Pricing</h2>
      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left',   width: 260 }}>Material</th>
            <th style={{ textAlign: 'center', width: 120 }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(mat => (
            <tr key={mat.id}>
              <td style={{ width: 260 }}>{mat.name}</td>
              <td style={{ width: 120 }}>
                <input type="number" min="0" value={mat.price ?? 0}
                  onChange={e => {
                    const v = Number(e.target.value || 0);
                    setMaterials(materials.map(x => x.id === mat.id ? { ...x, price: v } : x));
                    updPrice(mat.id, v);
                  }}
                  style={{ padding: 4, width: 120 }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
