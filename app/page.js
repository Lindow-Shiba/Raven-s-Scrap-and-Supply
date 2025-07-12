
'use client';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

const catalogue={
  'Car Internals':['Axle Parts','Body Repair Tools','Brake Pads','Clutch Kits','Fuel Straps','Radiator Part','Suspension Parts','Tire Repair Kit','Transmission Parts','Wires'],
  Materials:['Aluminium','Battery','Carbon','Clutch Fluid','Coil Spring','Copper','Copper Wires','Electronics','Graphite','Iron','Laminated Plastic','Lead','Multi-Purpose Grease','Paint Thinner','Plastic','Polymer','Polyethylene','Rubber','Rusted Metal','Scrap Metal','Silicone','Stainless Steel','Steel','Timing Belt','Gun Powder','Iron Ore'],
  'Extra Items':['Apple Phone','Adv Lockpick','Bottle Cap','Deformed Nail','Empty Bottle Glass','Horse Shoe','Leather','Lockpick','Old Coin','Pork & Beans','Repair Kit','Rusted Lighter','Rusted Tin Can','Rusted Watch','Samsung Phone']
};

function todayUS(){
  const d=new Date();
  const mm=String(d.getMonth()+1).padStart(2,'0');
  const dd=String(d.getDate()).padStart(2,'0');
  const yy=d.getFullYear();
  return `${mm}-${dd}-${yy}`;
}

export default function Home(){
  const [page,setPage]=useState('materials');
  const [cart,setCart]=useState({});
  const [who,setWho]=useState('');
  const [wh,setWh]=useState('');
  const [inv,setInv]=useState(`${todayUS()}-001`);
  const [notes,setNotes]=useState('');

  const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const del=id=>setCart(({[id]:_,...r})=>r);
  const setQty=(id,q)=>setCart(c=>q>0?({...c,[id]:q}):(({[id]:_,...rest}=c,rest)));

  const download=async()=>{
    const el=document.getElementById('receipt');
    if(!el)return;
    const canvas=await html2canvas(el,{background:'#fff'});
    const a=document.createElement('a');
    a.href=canvas.toDataURL();
    a.download=`${inv}.png`;
    a.click();
  };

  const nav=active=>({padding:'6px 12px',background:active?'#d1b07b':'transparent',color:active?'#000':'#d1b07b',border:'1px solid #d1b07b',cursor:'pointer'});

  return(
    <div style={{minHeight:'100vh'}}>
      <header style={{display:'flex',alignItems:'center',gap:12,padding:'8px 16px',background:'#111',borderBottom:'1px solid #333'}}>
        <Image src='/raven-logo.png' alt='logo' width={40} height={40}/>
        <h1 style={{fontSize:24,fontWeight:700}}>Raven's Scrap & Supply</h1>
        <div style={{marginLeft:'auto',display:'flex',gap:8}}>
          <button onClick={()=>setPage('materials')} style={nav(page==='materials')}>Materials</button>
          <button onClick={()=>setPage('database')} style={nav(page==='database')}>Database</button>
        </div>
      </header>

      {page==='materials'&&(
        <>
        <main style={{display:'flex',gap:32,padding:16}}>
          <section style={{flex:'1 0 320px',borderRight:'1px solid #d1b07b',paddingRight:16}}>
            <h2>Receipt</h2>
            <table style={{width:'100%',fontSize:14}}>
              <thead><tr><th>Item</th><th style={{width:60}}>Qty</th><th/></tr></thead>
              <tbody>
                {Object.entries(cart).filter(([,q])=>q>0).map(([id,qty])=>(
                  <tr key={id}>
                    <td>{id}</td>
                    <td><input type='number' min='0' value={qty} onChange={e=>setQty(id,parseInt(e.target.value||0))} style={{width:60,padding:2}}/></td>
                    <td><button onClick={()=>del(id)}><Trash2 size={14} color='white'/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{flex:2}}>
            {Object.entries(catalogue).map(([cat,items])=>(
              <div key={cat} style={{marginBottom:24}}>
                <h2>{cat}</h2>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {items.map(it=>(
                    <button key={it} onClick={()=>add(it)} style={{padding:8,background:'#d1b07b',color:'#000',border:'none',borderRadius:4,fontSize:12}}>
                      {it}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>

        <footer style={{padding:16,borderTop:'1px solid #333',display:'flex',flexDirection:'column',gap:8}}>
          <select value={who} onChange={e=>setWho(e.target.value)} style={{padding:8}}>
            <option value=''>Select your Name</option>
            <option>Alice</option><option>Bob</option><option>Charlie</option>
          </select>

          <select value={wh} onChange={e=>setWh(e.target.value)} style={{padding:8}}>
            <option value=''>Select Warehouse</option>
            <option value="Benny's">Benny's</option>
            <option value='CNC'>CNC</option>
          </select>

          <input value={inv} onChange={e=>setInv(e.target.value)} style={{padding:8}}/>

          <input placeholder='Notes' value={notes} onChange={e=>setNotes(e.target.value)} style={{padding:8}}/>

          <button onClick={download} style={{padding:10,background:'#d1b07b',color:'#000',border:'none',fontWeight:600}}>
            Post Invoice & Download
          </button>
        </footer>

        <div id='receipt' style={{display:'none',padding:16}}>
          <h3>Invoice {inv}</h3>
          <p>Name: {who}</p><p>Warehouse: {wh}</p><p>{todayUS()}</p>
          <table>{Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=><tr key={id}><td>{id}</td><td>{q}</td></tr>)}</table>
          <p>Notes: {notes}</p>
        </div>
        </>
      )}

      {page==='database'&&(
        <main style={{padding:16}}>
          <h2>Database (coming soon)</h2>
        </main>
      )}
    </div>
  );
}
