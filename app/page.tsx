
'use client';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Item {
  id: string;
  name: string;
  category: 'Car Internals' | 'Materials' | 'Extra Items';
}

const CAR_INTERNALS: Item[] = [
  'Axle Parts','Body Repair Tools','Brake Pads','Clutch Kits','Fuel Straps',
  'Radiator Part','Suspension Parts','Tire Repair Kit','Transmission Parts','Wires'
].map(name => ({ id: name.toLowerCase().replace(/\s+/g,'_'), name, category: 'Car Internals' }));

const MATERIALS: Item[] = [
  'Aluminium','Battery','Carbon','Clutch Fluid','Coil Spring','Copper','Copper Wires','Electronics','Graphite','Iron','Laminated Plastic','Lead','Multi-Purpose Grease','Paint Thinner','Plastic','Polymer','Polyethylene','Rubber','Rusted Metal','Scrap Metal','Silicone','Stainless Steel','Steel','Timing Belt','Gun Powder','Iron Ore'
].map(name => ({ id: name.toLowerCase().replace(/\s+/g,'_'), name, category: 'Materials' }));

const EXTRAS: Item[] = [
  'Apple Phone','Adv Lockpick','Bottle Cap','Deformed Nail','Empty Bottle Glass','Horse Shoe','Leather','Lockpick','Old Coin','Pork & Beans','Repair Kit','Rusted Lighter','Rusted Tin Can','Rusted Watch','Samsung Phone'
].map(name => ({ id: name.toLowerCase().replace(/\s+/g,'_'), name, category: 'Extra Items' }));

const ITEMS: Item[] = [...CAR_INTERNALS, ...MATERIALS, ...EXTRAS];

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [employees, setEmployees] = useState<string[]>(['John Doe','Jane Smith']);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [warehouse, setWarehouse] = useState<'AE'|'CNC'|''>('');
  const [page, setPage] = useState<'materials'|'database'>('materials');

  const add = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  const remove = (id: string) => setCart(({ [id]: _, ...rest }) => rest);

  const download = async () => {
    const el = document.getElementById('receipt');
    if(!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `invoice-${Date.now()}.png`;
    link.click();
  };

  const navStyle = (active: boolean): React.CSSProperties => ({
    padding:'6px 12px',
    background: active ? '#d1b07b' : 'transparent',
    color: active ? '#000' : '#d1b07b',
    border: '1px solid #d1b07b',
    borderRadius:4,
    marginLeft:4
  });

  return (
    <div>
      <header style={{ display:'flex',alignItems:'center',gap:12,background:'#111',padding:'8px 16px',borderBottom:'1px solid #333' }}>
        <Image src='/raven-logo.png' alt='Raven Logo' width={40} height={40} />
        <h1 style={{ fontSize:24,fontWeight:700 }}>Raven&apos;s Scrap & Supply</h1>
        <nav style={{ marginLeft:'auto' }}>
          <button style={navStyle(page==='materials')} onClick={() => setPage('materials')}>Materials</button>
          <button style={navStyle(page==='database')} onClick={() => setPage('database')}>Database</button>
        </nav>
      </header>

      {page === 'materials' && (
        <main style={{ display:'flex',gap:24,padding:16,flexWrap:'wrap' }}>
          {/* Receipt */}
          <section style={{ flex:'1 0 300px',borderRight:'1px solid #d1b07b',paddingRight:16 }}>
            <h2>Receipt</h2>
            <table style={{ width:'100%',fontSize:14 }}>
              <thead><tr><th>Item</th><th>Qty</th><th/></tr></thead>
              <tbody>
                {Object.entries(cart).map(([id, qty]) => {
                  const name = ITEMS.find(i => i.id === id)?.name || id;
                  return (
                    <tr key={id}>
                      <td>{name}</td>
                      <td>{qty}</td>
                      <td><button onClick={() => remove(id)}><Trash2 size={14} color='#fff'/></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop:16,display:'flex',flexDirection:'column',gap:8 }}>
              <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} style={{ padding:6 }}>
                <option value=''>Select your Name</option>
                {employees.map(emp => <option key={emp} value={emp}>{emp}</option>)}
              </select>

              <select value={warehouse} onChange={e => setWarehouse(e.target.value as 'AE'|'CNC'| '')} style={{ padding:6 }}>
                <option value=''>Select Warehouse</option>
                <option value='AE'>AE</option>
                <option value='CNC'>CNC</option>
              </select>

              <input placeholder='Invoice #' style={{ padding:6 }}/>
              <input placeholder='Notes' style={{ padding:6 }}/>
              <button onClick={download} style={{ padding:8,background:'#d1b07b',color:'#000',border:'none' }}>Post Invoice & Download</button>
            </div>

            <div id='receipt' style={{ display:'none' }}>
              <h3>Raven&apos;s Scrap & Supply Invoice</h3>
              <p>Employee: {selectedEmployee}</p>
              <p>Warehouse: {warehouse}</p>
              <table>
                <tbody>
                  {Object.entries(cart).map(([id, qty]) => {
                    const name = ITEMS.find(i => i.id === id)?.name || id;
                    return <tr key={id}><td>{name}</td><td>{qty}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Catalogue */}
          <section style={{ flex:'2 1 500px' }}>
            {(['Car Internals','Materials','Extra Items'] as const).map(cat => (
              <div key={cat} style={{ marginBottom:24 }}>
                <h2>{cat}</h2>
                <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                  {ITEMS.filter(i => i.category === cat).map(item => (
                    <button key={item.id} onClick={() => add(item.id)} style={{ padding:8,background:'#d1b07b',color:'#000',border:'none',borderRadius:4,fontSize:12 }}>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {page === 'database' && (
        <main style={{ padding:16 }}>
          <h2>Database (Coming Soon)</h2>
          <p style={{ fontStyle:'italic' }}>This section will list saved invoices once backend is connected.</p>
        </main>
      )}
    </div>
  );
}
