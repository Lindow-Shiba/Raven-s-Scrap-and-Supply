
'use client';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Item { id:string; name:string; category:'Car Internals'|'Materials'|'Extra Items'; }

const ITEMS: Item[] = [
  { id:'axle_parts',name:'Axle Parts',category:'Car Internals' },
  { id:'body_repair_tools',name:'Body Repair Tools',category:'Car Internals' },
  { id:'brake_pads',name:'Brake Pads',category:'Car Internals' },
  { id:'clutch_kits',name:'Clutch Kits',category:'Car Internals' },
  { id:'fuel_straps',name:'Fuel Straps',category:'Car Internals' },
  { id:'radiator_part',name:'Radiator Part',category:'Car Internals' },
  { id:'suspension_parts',name:'Suspension Parts',category:'Car Internals' },
  { id:'tire_repair_kit',name:'Tire Repair Kit',category:'Car Internals' },
  { id:'transmission_parts',name:'Transmission Parts',category:'Car Internals' },
  { id:'wires',name:'Wires',category:'Car Internals' },
  ...'Aluminium,Battery,Carbon,Clutch Fluid,Coil Spring,Copper,Copper Wires,Electronics,Graphite,Iron,Laminated Plastic,Lead,Multi-Purpose Grease,Paint Thinner,Plastic,Polymer,Polyethylene,Rubber,Rusted Metal,Scrap Metal,Silicone,Stainless Steel,Steel,Timing Belt,Gun Powder,Iron Ore'.split(',').map(n=>({id:n.toLowerCase().replace(/\s+/g,'_'),name:n,category:'Materials'})),
  ...'Apple Phone,Adv Lockpick,Bottle Cap,Deformed Nail,Empty Bottle Glass,Horse Shoe,Leather,Lockpick,Old Coin,Pork & Beans,Repair Kit,Rusted Lighter,Rusted Tin Can,Rusted Watch,Samsung Phone'.split(',').map(n=>({id:n.toLowerCase().replace(/\s+/g,'_'),name:n,category:'Extra Items'})),
];

export default function Home(){
  const [cart,setCart]=useState<Record<string,number>>({});
  const [employees,setEmployees]=useState(['John Doe','Jane Smith']);
  const [selectedEmployee,setSelectedEmployee]=useState('');
  const [warehouse,setWarehouse]=useState<'AE'|'CNC'|''>('');
  const [page,setPage]=useState<'materials'|'database'>('materials');

  const add=(id:string)=>setCart(p=>({...p,[id]:(p[id]||0)+1}));
  const del=(id:string)=>setCart(({[id]:_,...r})=>r);

  const save=async()=>{
    const el=document.getElementById('receipt');
    if(!el)return; const c=await html2canvas(el,{backgroundColor:'#fff'});
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download=`invoice-${Date.now()}.png`; a.click();
  };

  const banner={display:'flex',alignItems:'center',gap:12,background:'#111',padding:'8px 16px',borderBottom:'1px solid #333'};
  const nav=(a:boolean)=>({padding:'6px 12px',background:a?'#d1b07b':'transparent',color:a?'#000':'#d1b07b',border:'1px solid #d1b07b',cursor:'pointer'});

  return (
    <div style={{minHeight:'100vh'}}>
      <header style={banner}>
        <Image src="/raven-logo.png" alt="Raven Logo" width={40} height={40}/>
        <h1 style={{fontSize:24,fontWeight:700}}>Raven's Scrap & Supply</h1>
        <div style={{marginLeft:'auto',display:'flex',gap:8}}>
          <button style={nav(page==='materials')} onClick={()=>setPage('materials')}>Materials</button>
          <button style={nav(page==='database')} onClick={()=>setPage('database')}>Database</button>
        </div>
      </header>

      {page==='materials' && (
        <main style={{padding:16,display:'flex',gap:24}}>
          <section style={{flex:'1 0 300px',borderRight:'1px solid #d1b07b',paddingRight:16}}>
            <h2>Receipt</h2>
            <table style={{width:'100%',fontSize:14}}><thead><tr><th>Item</th><th>Qty</th><th></th></tr></thead><tbody>
              {Object.entries(cart).map(([id,q])=>{
                const n=ITEMS.find(i=>i.id===id)?.name||id;
                return <tr key={id}><td>{n}</td><td>{q}</td><td><button onClick={()=>del(id)}><Trash2 size={14} color="white"/></button></td></tr>;})}
            </tbody></table>

            <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:8}}>
              <select value={selectedEmployee} onChange={e=>setSelectedEmployee(e.target.value)} style={{padding:6}}>
                <option value="">Select your Name</option>{employees.map(e=><option key={e}>{e}</option>)}
              </select>
              <select value={warehouse} onChange={e=>setWarehouse(e.target.value as any)} style={{padding:6}}>
                <option value="">Select Warehouse</option><option value="AE">AE</option><option value="CNC">CNC</option>
              </select>
              <input placeholder="Invoice #" style={{padding:6}}/>
              <input placeholder="Notes" style={{padding:6}}/>
              <button onClick={save} style={{padding:8,background:'#d1b07b',color:'#000',border:'none',cursor:'pointer'}}>Post Invoice & Download</button>
            </div>

            <div id="receipt" style={{display:'none'}}>
              <h3>Raven's Scrap & Supply Invoice</h3><p>Employee: {selectedEmployee}</p><p>Warehouse: {warehouse}</p>
              <table>{Object.entries(cart).map(([id,q])=>{const n=ITEMS.find(i=>i.id===id)?.name||id;return <tr key={id}><td>{n}</td><td>{q}</td></tr>;})}</table>
            </div>
          </section>

          <section style={{flex:2}}>
            {(['Car Internals','Materials','Extra Items'] as const).map(cat=>(
              <div key={cat} style={{marginBottom:24}}>
                <h2>{cat}</h2>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {ITEMS.filter(i=>i.category===cat).map(it=><button key={it.id} onClick={()=>add(it.id)} style={{padding:8,background:'#d1b07b',color:'#000',border:'none',borderRadius:4,fontSize:12}}>{it.name}</button>)}
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {page==='database' && (
        <main style={{padding:16}}>
          <h2>Database (Coming Soon)</h2>
          <p style={{fontStyle:'italic'}}>This section will list saved invoices once backend is connected.</p>
        </main>
      )}
    </div>
  );
}
