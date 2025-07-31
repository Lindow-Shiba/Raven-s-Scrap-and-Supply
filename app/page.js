'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/* ══════════════ CONFIG ══════════════ */
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/...'; // replace with yours

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

  useEffect(() => {
    supabase.from('employees').select('*').order('name')
      .then(({ data }) => setEmployees(data || []));
  }, []);

  const add = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const del = id => setCart(({ [id]: _, ...rest }) => rest);
  const setQty = (id, q) => setCart(c => (q > 0 ? { ...c, [id]: q } : { ...c, [id]: undefined }));

  const uploadInvoice = async () => {
    const el = document.getElementById('left-panel');
    if (!el) return;
    const cartEntries = Object.entries(cart).filter(([, q]) => q > 0);
    const summary = cartEntries.map(([item, q]) => `• **${item}** × ${q}`).join('\n') || 'No items';

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

      {page === 'materials' && (
        <div style={{ flex: 1, display: 'flex' }}>
          <section id="left-panel" style={{
            flex: '1 0 320px', borderRight: '1px solid #d1b07b',
            padding: 16, display: 'flex', flexDirection: 'column'
          }}>
            {/* Receipt Panel */}
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
    </div>
  );
}
