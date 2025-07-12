'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function EmployeeDatabase() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-white">
        <h1 className="text-2xl">Employee Database</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 bg-black border border-gray-700"
        />
        <button
          onClick={() => {
            if (password === 'RavenAdmin') setUnlocked(true);
            else toast.error('Wrong password');
          }}
          className="px-4 py-2 bg-amber-700"
        >
          Unlock
        </button>
      </div>
    );
  }

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRows();
  }, []);

  async function fetchRows() {
    const { data, error } = await supabase.from('employees').select('*').order('name');
    if (error) toast.error(error.message);
    else setRows(data);
    setLoading(false);
  }

  async function updateRow(id, commission_pct) {
    const { error } = await supabase
      .from('employees')
      .update({ commission_pct })
      .eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Saved \u2713');
  }

  const COMMISSION_OPTIONS = [0.75, 0.8, 0.85, 0.9];

  if (loading) return <p className="p-8 text-white">Loading...</p>;

  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl mb-6">Employee Commission %</h1>
      <div className="grid grid-cols-3 gap-4 font-bold border-b border-gray-700 pb-2 mb-2">
        <span>Name</span>
        <span className="text-center">Commission %</span>
        <span></span>
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-800"
        >
          <span>{row.name}</span>
          <select
            value={row.commission_pct ?? 0.75}
            onChange={(e) => {
              const pct = Number(e.target.value);
              setRows((r) =>
                r.map((rw) => (rw.id === row.id ? { ...rw, commission_pct: pct } : rw))
              );
              updateRow(row.id, pct);
            }}
            className="bg-black border border-gray-700 p-2 text-center"
          >
            {COMMISSION_OPTIONS.map((pct) => (
              <option key={pct} value={pct}>
                {pct * 100} %
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-400 text-right">
            {row.updated_at ? 'Updated ' + new Date(row.updated_at).toLocaleString() : ''}
          </span>
        </div>
      ))}
    </div>
  );
}