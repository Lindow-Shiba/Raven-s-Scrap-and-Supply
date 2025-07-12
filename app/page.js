
'use client';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const catalogue={'Car Internals':['Body Repair Tools','Clutch Kits'],'Materials':['Aluminium'],'Extra Items':['Bottle Cap']};

export default function Home() {
  const [page,setPage]=useState('materials');
  const [names,setNames]=useState([]);
  const [cart,setCart]=useState({});
  const [who,setWho]=useState('');
  const today=()=>{const d=new Date();return `${d.getMonth()+1}-${d.getDate()}-${d.getFullYear()}`};
  const [inv]=useState(`${today()}-001`);
  const [warehouse,setWarehouse]=useState('');
  const [notes,setNotes]=useState('');
  const receiptRef=useRef(null);

  useEffect(()=>{supabase.from('employees').select('name').then(({data})=>setNames(data?.map(x=>x.name)||[]));},[]);

  const add=item=>setCart(c=>({...c,[item]:(c[item]||0)+1}));
  const setQty=(item,q)=>setCart(c=>({...c,[item]:q}));
  const remove=item=>setCart(({[item]:_,...rest})=>rest);

  const download=async()=>{
    if(!receiptRef.current) return;
    const canvas=await html2canvas(receiptRef.current,{background:'#fff',scale:2});
    const link=document.createElement('a');
    link.download=`${inv}.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
  };

  return(
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <header style={{display:'flex',alignItems:'center',gap:12,padding:'8px 16px',background:'#111'}}>
        <Image src='/raven-logo.png' alt='logo' width={60} height={60}/>
        <h1 style={{fontSize:28,fontWeight:700}}>Raven's Scrap & Supply</h1>
      </header>

      {page==='materials'&&(
        <div style={{display:'flex',flex:1}}>
          {/* Left Column */}
          <div style={{flex:'1 0 350px',borderRight:'1px solid #d1b07b',padding:16,display:'flex',flexDirection:'column'}} ref={receiptRef}>
            <h2>Receipt</h2>
            <table style={{width:'100%',fontSize:14}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left'}}>Item</th>
                  <th style={{textAlign:'right',width:80}}>Qty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cart).map(([item,qty])=>(
                  <tr key={item}>
                    <td>{item}</td>
                    <td style={{textAlign:'right'}}>
                      <input type='number' min='0' value={qty} onChange={e=>setQty(item,parseInt(e.target.value||0))} style={{width:60,textAlign:'right'}}/>
                    </td>
                    <td><button onClick={()=>remove(item)}><Trash2 size={14} color='white'/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <select value={who} onChange={e=>setWho(e.target.value)} style={{marginTop:16,padding:8}}>
              <option value=''>Select your Name</option>
              {names.map(n=><option key={n}>{n}</option>)}
            </select>

            <select value={warehouse} onChange={e=>setWarehouse(e.target.value)} style={{marginTop:8,padding:8}}>
              <option value=''>Select Warehouse</option>
              <option>Benny's</option><option>CNC</option>
            </select>

            <input value={inv} readOnly style={{marginTop:8,padding:8}}/>
            <input placeholder='Notes' value={notes} onChange={e=>setNotes(e.target.value)} style={{marginTop:8,padding:8}}/>

            <button onClick={download} style={{marginTop:8,padding:10,background:'#d1b07b',border:'none',color:'#000'}}>Download Invoice</button>
          </div>

          {/* Right Catalogue */}
          <div style={{flex:2,padding:16}}>
            {Object.entries(catalogue).map(([cat,items])=>(
              <div key={cat} style={{marginBottom:24}}>
                <h2>{cat}</h2>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {items.map(it=><button key={it} onClick={()=>add(it)} style={{padding:8,background:'#d1b07b',border:'none',color:'#000'}}>{it}</button>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
