
'use client';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const catalogue={ 'Car Internals':['Clutch Kits'] };

export default function Home(){
  const [cart,setCart]=useState({});
  const [names,setNames]=useState([]);
  const [who,setWho]=useState('');
  useEffect(()=>{supabase.from('employees').select('name').then(({data})=>setNames(data?.map(r=>r.name)||[]));},[]);
  const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const setQty=(id,q)=>setCart(c=>({...c,[id]:q}));
  const recRef=useRef(null);
  const download=async()=>{
    const canvas=await html2canvas(recRef.current,{background:'#fff'});
    const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='invoice.png';a.click();
  };
  return(<div>
    <button onClick={()=>add('Clutch Kits')}>Add</button>
    <div style={{width:400}} ref={recRef}>
      <table style={{width:'100%'}}><thead><tr><th style={{textAlign:'left'}}>Item</th><th style={{textAlign:'right',width:100}}>Qty</th></tr></thead>
      <tbody>{Object.entries(cart).map(([id,q])=>(
        <tr key={id}><td>{id}</td><td style={{textAlign:'right'}}><input value={q} type='number' min='0' onChange={e=>setQty(id,parseInt(e.target.value))} style={{width:60}}/></td></tr>
      ))}</tbody></table>
    </div>
    <button onClick={download}>Download Invoice</button>
  </div>);
}
