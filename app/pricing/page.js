'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PricingPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (unlocked) {
      fetchMaterials();
    }
  }, [unlocked]);

  async function fetchMaterials() {
    const { data, error } = await supabase.from('materials').select('*').order('name');
    if (error) setError(error);
    else setMaterials(data);
    setLoading(false);
  }

  async function handleChange(id, field, value) {
    const newMaterials = materials.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setMaterials(newMaterials);
  }

  async function handleBlur(id, name, price) {
    await supabase.from('materials').update({ name, price }).eq('id', id);
  }

  async function addRow() {
    const { data, error } = await supabase
      .from('materials')
      .insert({ name: '', price: 0 })
      .select()
      .single();
    if (!error && data) setMaterials([...materials, data]);
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white gap-4">
        <h1 className="text-lg text-amber-400">Enter Admin Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-48 p-2 bg-black border border-gray-700 text-center"
        />
        <button
          onClick={() => {
            if (password === 'RavenAdmin') setUnlocked(true);
            else console.error('Incorrect password');
          }}
          className="bg-amber-700 px-6 py-1 text-sm"
        >
          Unlock
        </button>
      </div>
    );
  }

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;

 // ...imports and password gate stay the same

return (
  <div className="p-8 text-white flex flex-col items-center">
    <h1 className="text-2xl mb-6">Materials Pricing</h1>

    <div className="w-full max-w-md">
      {/* Header */}
      <div className="grid grid-cols-2 gap-2 font-bold border-b border-gray-700 pb-1 mb-2">
        <span>Material</span>
        <span className="text-right">Price</span>
      </div>

      {/* Rows */}
      {materials.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-2 gap-2 items-center py-1 border-b border-gray-800"
        >
          <input
            value={row.name || ''}
            onChange={(e) => handleChange(row.id, 'name', e.target.value)}
            onBlur={() => handleBlur(row.id, row.name, row.price)}
            className="bg-black border border-gray-700 p-1"
          />
          <input
            type="number"
            value={row.price || 0}
            onChange={(e) => handleChange(row.id, 'price', Number(e.target.value))}
            onBlur={() => handleBlur(row.id, row.name, row.price)}
            className="bg-black border border-gray-700 p-1 text-right"
          />
        </div>
      ))}

      <button
        onClick={addRow}
        className="mt-3 px-4 py-1 bg-amber-700 w-full text-sm"
      >
        Add Material
      </button>
    </div>
  </div>
);
