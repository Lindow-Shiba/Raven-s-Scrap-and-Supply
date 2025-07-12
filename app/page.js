
'use client';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

const items = (()=>{
  const arr=[
    'Axle Parts','Body Repair Tools','Brake Pads','Clutch Kits','Fuel Straps','Radiator Part','Suspension Parts','Tire Repair Kit','Transmission Parts','Wires'
  ].map(n=>({id:n.toLowerCase().replace(/\s+/g,'_'),name:n,cat:'Car Internals'}));

  const materials='Aluminium,Battery,Carbon,Clutch Fluid,Coil Spring,Copper,Copper Wires,Electronics,Graphite,Iron,Laminated Plastic,Lead,Multi-Purpose Grease,Paint Thinner,Plastic,Polymer,Polyethylene,Rubber,Rusted Metal,Scrap Metal,Silicone,Stainless Steel,Steel,Timing Belt,Gun Powder,Iron Ore'
    .split(',').map(n=>({id:n.toLowerCase().replace(/\s+/g,'_'),name:n,cat:'Materials'}));

  const extra='Apple Phone,Adv Lockpick,Bottle Cap,Deformed Nail,Empty Bottle Glass,Horse Shoe,Leather,Lockpick,Old Coin,Pork & Beans,Repair Kit,Rusted Lighter,Rusted Tin Can,Rusted Watch,Samsung Phone'
    .split(',').map(n=>({id:n.toLowerCase().replace(/\s+/g,'_'),name:n,cat:'Extra Items'}));

  return [...arr,...materials,...extra];
})();

export default function Home(){
  const [cart,setCart]=useState({});
  const [employees,setEmployees]=useState(['John Doe','Jane Smith']);
  const [employee,setEmployee]=useState('');
  const [warehouse,setWarehouse]=useState('');
  const [page,setPage]=useState('materials');

  const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const del=id=>setCart(({[id]:_,...r})=>r);

  const save=async()=>{
    const el=document.getElementById('receipt');
    if(!el)return;
    const canvas=await html2canvas(el,{backgroundColor:'#fff'});
    const a=document.createElement('a');
    a.href=canvas.toDataURL('image/png');
    a.download='invoice-'+Date.now()+'.png';
    a.click();
  };

  const bannerStyle={display:'flex',alignItems:'center',gap:12,background:'#111',padding:'8px 16px',borderBottom:'1px solid #333'};
  const nav=active=>({padding:'6px 12px',background:active?'#d1b07b':'transparent',color:active?'#000':'#d1b07b',border:'1px solid #d1b07b',cursor:'pointer'});

  return (
    <div style={{minHeight:'100vh'}}>
      <header style={bannerStyle}>
        <Image src="/raven-logo.png" alt="logo" width={40} height={40}/>
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
            <table style={{width:'100%',fontSize:14}}>
              <thead><tr><th>Item</th><th>Qty</th><th></th></tr></thead>
              <tbody>
                {Object.entries(cart).map(([id,qty])=>{
                  const item=items.find(i=>i.id===id);
                  return (
                    <tr key={id}>
                      <td>{item?.name||id}</td>
                      <td>{qty}</td>
                      <td><button onClick={()=>del(id)}><Trash2 size={14} color="white"/></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:8}}>
              <select value={employee} onChange={e=>setEmployee(e.target.value)} style={{padding:6}}>
                <option value="">Select your Name</option>
                {employees.map(e=><option key={e}>{e}</option>)}
              </select>
              <select value={warehouse} onChange={e=>setWarehouse(e.target.value)} style={{padding:6}}>
                <option value="">Select Warehouse</option>
                <option value="AE">AE</option>
                <option value="CNC">CNC</option>
              </select>
              <input placeholder="Invoice #" style={{padding:6}}/>
              <input placeholder="Notes" style={{padding:6}}/>
              <button onClick={save} style={{padding:8,background:'#d1b07b',color:'#000',border:'none',cursor:'pointer'}}>Post Invoice & Download</button>
            </div>

            <div id="receipt" style={{display:'none'}}>
              <h3>Raven's Scrap & Supply Invoice</h3>
              <p>Employee: {employee}</p>
              <p>Warehouse: {warehouse}</p>
              <table>
                <tbody>
                  {Object.entries(cart).map(([id,qty])=>{
                    const item=items.find(i=>i.id===id);
                    return <tr key={id}><td>{item?.name||id}</td><td>{qty}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{flex:2}}>
            {['Car Internals','Materials','Extra Items'].map(cat=>(
              <div key={cat} style={{marginBottom:24}}>
                <h2>{cat}</h2>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {items.filter(i=>i.cat===cat).map(it=>(
                    <button key={it.id} onClick={()=>add(it.id)} style={{padding:8,background:'#d1b07b',color:'#000',border:'none',borderRadius:4,fontSize:12}}>
                      {it.name}
                    </button>
                  ))}
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
