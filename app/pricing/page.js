
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PricingPage() {
  const [allowed,setAllowed]=useState(false);
  const [pw,setPw]=useState('');
  if(!allowed){
    return (
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:16,height:'100vh',color:'#d1b07b'}}>
        <h2>Enter Admin Password</h2>
        <input type='password' value={pw} onChange={e=>setPw(e.target.value)} placeholder='Password…' style={{padding:8,color:'#000'}}/>
        <button onClick={()=>{pw==='RavenAdmin' ? setAllowed(true):alert('Wrong password');}} style={{padding:'6px 12px',background:'#d1b07b',border:'none',color:'#000'}}>Unlock</button>
      </div>
    );
  }

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    const { data, error } = await supabase.from('materials').select('*').order('name');
    if (error) setError(error);
    else setMaterials(data);
    setLoading(false);
  }

  async function handleChange(id, field, value) {
    setMaterials(mat=>mat.map((row)=>row.id===id?{...row,[field]:value}:row));
  }

  async function handleBlur(id, name, price) {
    await supabase.from('materials').update({ name, price }).eq('id', id);
  }

  async function addRow() {
    const { data } = await supabase.from('materials').insert({ name: '', price: 0 }).select().single();
    if (data) setMaterials([...materials, data]);
  }

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Materials Pricing</h1>
      <div className="max-w-xl">
        {materials.map((row) => (
          <div key={row.id} className="flex mb-2">
            <input
              value={row.name || ''}
              onChange={(e) => handleChange(row.id, 'name', e.target.value)}
              onBlur={() => handleBlur(row.id, row.name, row.price)}
              className="flex-1 bg-black border border-gray-700 p-2 mr-2"
            />
            <input
              type="number"
              value={row.price || 0}
              onChange={(e) => handleChange(row.id, 'price', Number(e.target.value))}
              onBlur={() => handleBlur(row.id, row.name, row.price)}
              className="w-32 bg-black border border-gray-700 p-2 text-right"
            />
          </div>
        ))}
        <button onClick={addRow} className="mt-4 px-4 py-2 bg-amber-700">Add Material</button>
      </div>
    </div>
  );
}
