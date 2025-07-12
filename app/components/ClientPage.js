
'use client';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const catalogue={
  'Car Internals':['Axle Parts','Body Repair Tools','Brake Pads','Clutch Kits','Fuel Straps','Radiator Part','Suspension Parts','Tire Repair Kit','Transmission Parts','Wires'],
  'Materials':['Aluminium','Battery','Carbon','Clutch Fluid','Coil Spring','Copper','Copper Wires','Electronics','Graphite','Iron','Laminated Plastic','Lead','Multi-Purpose Grease','Paint Thinner','Plastic','Polymer','Polyethylene','Rubber','Rusted Metal','Scrap Metal','Silicone','Stainless Steel','Steel','Timing Belt','Gun Powder','Iron Ore'],
  'Extra Items':['Apple Phone','Adv Lockpick','Bottle Cap','Deformed Nail','Empty Bottle Glass','Horse Shoe','Leather','Lockpick','Old Coin','Pork & Beans','Repair Kit','Rusted Lighter','Rusted Tin Can','Rusted Watch','Samsung Phone']
};

export default function Home(){
  const [page,setPage]=useState('materials');
const [priceMap, setPriceMap] = useState({});
  const [cart,setCart]=useState({});
  const [names,setNames]=useState([]);
  const [who,setWho]=useState('');
  const [wh,setWh]=useState('');
  const todayUS=()=>{const d=new Date();return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}-${d.getFullYear()}`};
  const [inv,setInv]=useState(`${todayUS()}-001`);
  const [notes,setNotes]=useState('');

  useEffect(()=>{supabase.from('employees').select('name').order('name').then(({data})=>setNames(data?.map(r=>r.name)||[]));},[]);

  const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const del=id=>setCart(({[id]:_,...r})=>r);
  const setQty=(id,q)=>setCart(c=>q>0?({...c,[id]:q}):({...c,[id]:undefined}));

  
  
const download = async () => {
  const el = document.getElementById('left-panel');
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: '#fff' });
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${inv}.png`;
  link.click();

  // discord webhook
  const summary = Object.entries(cart).filter(([, q]) => q > 0).map(([item, q]) => `• **${item}** × ${q}`).join('\n') || 'No items';

  fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK, {
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
          { name: 'Date', value: new Date().toLocaleString(), inline: false },
          { name: 'Items', value: summary, inline: false }
        ]
      }]
    })
  });
};


  const nav=act=>({padding:'6px 12px',background:act?'#d1b07b':'transparent',color:act?'#000':'#d1b07b',border:'1px solid #d1b07b',cursor:'pointer'});

  return(<div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
    <header style={{display:'flex',alignItems:'center',gap:12,padding:'8px 16px',background:'#111',borderBottom:'1px solid #333'}}>
      <Image src='/raven-logo.png' alt='logo' width={60} height={60}/>
      <h1 style={{fontSize:28,fontWeight:700}}>Raven's Scrap & Supply</h1>
      <div style={{marginLeft:'auto',display:'flex',gap:8}}>
        <button style={nav(page==='materials')} onClick={()=>setPage('materials')}>Materials</button>
        <button style={nav(page==='database')} onClick={()=>setPage('database')}>Database</button>
      </div>
    </header>

    {page==='materials'&&(
      <div style={{flex:1,display:'flex'}}>
        <section id='left-panel' style={{flex:'1 0 320px',borderRight:'1px solid #d1b07b',padding:16,display:'flex',flexDirection:'column'}}>
          <h2>Receipt</h2>
          <table style={{width:'100%',fontSize:14}}>
            <thead><tr>
      <th style={{ textAlign:'left' }}>Item</th>
      <th style={{ textAlign:'center', width:60 }}>Qty</th>
      <th style={{ width:30 }}></th>
    </tr></thead>
            <tbody>
              {Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>(
                <tr key={id}>
                  <td>{id}</td>
                  <td><input type='number' min='0' value={q} style={{width:60}} onChange={e=>setQty(id,parseInt(e.target.value||0))}/></td>
                  <td><button onClick={()=>del(id)}><Trash2 size={14} color='white'/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{flex:1}}/>
          <footer style={{display:'flex',flexDirection:'column',gap:8}}>
            <select value={who} onChange={e=>setWho(e.target.value)} style={{padding:8}}>
              <option value=''>Select your Name</option>{names.map(n=><option key={n}>{n}</option>)}
            </select>
            <select value={wh} onChange={e=>setWh(e.target.value)} style={{padding:8}}>
              <option value=''>Select Warehouse</option><option>Benny's</option><option>CNC</option>
            </select>
            <input value={inv} onChange={e=>setInv(e.target.value)} style={{padding:8}}/>
            <input placeholder='Notes' value={notes} onChange={e=>setNotes(e.target.value)} style={{padding:8}}/>
            <button onClick={download} style={{padding:10,background:'#d1b07b',color:'#000',border:'none',fontWeight:600}}>Download Invoice</button>
          </footer>
        </section>
        <section style={{flex:2,padding:16}}>
          {Object.entries(catalogue).map(([cat,items])=>(
            <div key={cat} style={{marginBottom:24}}>
              <h2>{cat}</h2>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {items.map(it=><button key={it} onClick={()=>add(it)} style={{padding:8,background:'#d1b07b',color:'#000',border:'none',borderRadius:4,fontSize:12}}>{it}</button>)}
              </div>
            </div>
          ))}
        </section>
        <div id='receipt' style={{display:'none',padding:16}}>
          <h3>Invoice {inv}</h3><p>Name: {who}</p><p>Warehouse: {wh}</p>
          <table>{Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=><tr key={id}><td>{id}</td><td>{q}</td></tr>)}</table><p>Notes: {notes}</p>
        </div>
      </div>
    )}

    {page==='database'&&<DatabaseGate><DatabasePage/></DatabaseGate>}
  </div>);
}

function DatabaseGate({children}){
  const [allowed,setAllowed]=useState(false);
  const [pw,setPw]=useState('');
  if(allowed) return children;
  return <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:16}}>
    <h2>Enter Admin Password</h2>
    <input type='password' value={pw} onChange={e=>setPw(e.target.value)} placeholder='Password…' style={{padding:8}}/>
    <button onClick={()=>{pw==='RavenAdmin'?setAllowed(true):alert('Incorrect');}} style={{padding:'6px 18px',background:'#d1b07b',border:'none',color:'#000'}}>Unlock</button>
  </div>;
}

function DatabasePage(){
  const [rows,setRows]=useState([]);
  const [name,setName]=useState('');const [cid,setCid]=useState('');
  const load=()=>supabase.from('employees').select('*').order('id',{ascending:false}).then(({data})=>setRows(data||[]));
  useEffect(load,[]);
  const add=async()=>{if(!name||!cid)return;await supabase.from('employees').insert({name,cid});setName('');setCid('');load();};
  const upd=async(id,field,val)=>{await supabase.from('employees').update({[field]:val}).eq('id',id);};
  const del=async(id)=>{await supabase.from('employees').delete().eq('id',id);load();};

  return <main style={{padding:16,flex:1}}>
    <h2>Employees</h2>
    <div style={{display:'flex',gap:8,marginBottom:16}}>
      <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} style={{padding:6,width:240}}/>
      <input placeholder='CID' value={cid} onChange={e=>setCid(e.target.value)} style={{padding:6,width:120}}/>
      <button onClick={add} style={{padding:'6px 12px',background:'#d1b07b',border:'none',color:'#000'}}>Add</button>
    </div>
    <table style={{width:'100%',fontSize:14}}>
      <thead><tr>
      <th style={{ textAlign:'left' }}>Item</th>
      <th style={{ textAlign:'center', width:60 }}>Qty</th>
      <th style={{ width:30 }}></th>
    </tr></thead>
      <tbody>
        {rows.map(r=><tr key={r.id}>
          <td>{r.id}</td>
          <td><input value={r.name} onChange={e=>{const v=e.target.value;setRows(rows.map(x=>x.id===r.id?({...x,name:v}):x));upd(r.id,'name',v);}} style={{padding:4,width:220}}/></td>
          <td><input value={r.cid} onChange={e=>{const v=e.target.value;setRows(rows.map(x=>x.id===r.id?({...x,cid:v}):x));upd(r.id,'cid',v);}} style={{padding:4,width:100}}/></td>
          <td><button onClick={()=>del(r.id)} style={{background:'red',color:'#fff',border:'none',padding:'4px 8px'}}>Delete</button></td>
        </tr>)}
      </tbody>
    </table>
  </main>;
}


const submit = async () => {
  // 1. Guard: prices must exist
  if (!Object.keys(priceMap).length) {
    alert('Prices are still loading. Please wait a moment and try again.');
    return;
  }

  // 2. Guard: at least one item has quantity
  if (!items.some(it => (it.qty || 0) > 0)) {
    alert('No items with quantity entered.');
    return;
  }

  // 3. Build payload lines
  const lines = items
    .filter(it => (it.qty || 0) > 0)
    .map(it => {
      const unitPrice = priceMap[it.name];
      if (unitPrice === undefined) {
        console.warn(`No price for ${it.name}`);
        return `${it.name} × ${it.qty} — PRICE NOT FOUND`;
      }
      const subtotal = (unitPrice * it.qty).toFixed(2);
      return `${it.name} × ${it.qty} — $${unitPrice.toFixed(2)} ea = **$${subtotal}**`;
    });

  // 4. Grand total
  const grandTotal = items.reduce(
    (sum, it) => sum + ((it.qty || 0) * (priceMap[it.name] || 0)),
    0
  ).toFixed(2);
  lines.push(`
__**Total: $${grandTotal}**__`);

  console.log('Discord payload:
', lines.join('
'));

  // 5. Post to Discord
  try {
    await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: lines.join('
') })
    });
    alert('Invoice submitted');
  } catch (err) {
    console.error('Discord webhook failed', err);
    alert('Invoice submitted, but Discord notification failed.');
  }
};

