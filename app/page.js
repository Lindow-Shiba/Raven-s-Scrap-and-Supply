// app/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1394330571257417770/2xNNVkVVs-5yivGIxFnVhaI6j9VKwhzjZ0Z8nn_TJ_q5VFJUHgQldmI30CJtdJt7bk_0';

const catalogue = {
  'Car Internals': [
    'Axle Parts', 'Body Repair Tools', 'Brake Pads', 'Clutch Kits', 'Fuel Straps',
    'Radiator Part', 'Suspension Parts', 'Tire Repair Kit', 'Transmission Parts', 'Wires'
  ],
  Materials: [
    'Aluminium', 'Battery', 'Carbon', 'Clutch Fluid', 'Coil Spring', 'Copper',
    'Copper Wires', 'Electronics', 'Graphite', 'Iron', 'Laminated Plastic', 'Lead',
    'Multi-Purpose Grease', 'Paint Thinner', 'Plastic', 'Polymer', 'Polyethylene',
    'Rubber', 'Rusted Metal', 'Scrap Metal', 'Silicone', 'Stainless Steel', 'Steel',
    'Timing Belt', 'Gun Powder', 'Iron Ore'
  ],
  'Extra Items': [
    'Apple Phone', 'Adv Lockpick', 'Bottle Cap', 'Deformed Nail', 'Empty Bottle Glass',
    'Horse Shoe', 'Leather', 'Lockpick', 'Old Coin', 'Pork & Beans', 'Repair Kit',
    'Rusted Lighter', 'Rusted Tin Can', 'Rusted Watch', 'Samsung Phone', 'Recycle Part'
  ]
};

function DatabasePage({ refresh }) {
  const [employees, setEmployees] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [name, setName] = useState('');
  const [cid, setCid] = useState('');

  const [newMaterial, setNewMaterial] = useState('');

  const loadEmployees = () =>
    supabase.from('employees').select('*').order('id', { ascending: false })
      .then(({ data }) => setEmployees(data || []));

  const loadMaterials = () =>
    supabase.from('materials').select('*').order('name')
      .then(({ data }) => setMaterials(data || []));

  useEffect(() => { loadEmployees(); loadMaterials(); }, []);

  const addEmployee = async () => {
    if (!name || !cid) return;
    await supabase.from('employees').insert({ name, cid });
    setName(''); setCid('');
    loadEmployees(); refresh();
  };

  const updEmployee = async (id, field, val) => {
    await supabase.from('employees').update({ [field]: val }).eq('id', id);
    loadEmployees(); refresh();
  };

  const delEmployee = async id => {
    await supabase.from('employees').delete().eq('id', id);
    loadEmployees(); refresh();
  };

  const addMaterial = async () => {
    if (!newMaterial) return;
    await supabase.from('materials').insert({ name: newMaterial });
    setNewMaterial('');
    loadMaterials();
  };

  const delMaterial = async id => {
    await supabase.from('materials').delete().eq('id', id);
    loadMaterials();
  };

  return (
    <main style={{ padding: 16, flex: 1 }}>
      <h2>Employees</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)}
          style={{ padding: 6, width: 180 }} />
        <input placeholder="CID" value={cid} onChange={e => setCid(e.target.value)}
          style={{ padding: 6, width: 120 }} />
        <button onClick={addEmployee} style={{
          padding: '6px 12px', background: '#d1b07b', border: 'none', color: '#000'
        }}>Add</button>
      </div>

      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: 180 }}>Name</th>
            <th style={{ textAlign: 'center', width: 120 }}>CID</th>
            <th style={{ width: 30 }}></th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td><input value={emp.name}
                onChange={e => {
                  const v = e.target.value;
                  setEmployees(employees.map(x => x.id === emp.id ? { ...x, name: v } : x));
                  updEmployee(emp.id, 'name', v);
                }}
                style={{ padding: 4, width: 180 }} /></td>
              <td><input value={emp.cid}
                onChange={e => {
                  const v = e.target.value;
                  setEmployees(employees.map(x => x.id === emp.id ? { ...x, cid: v } : x));
                  updEmployee(emp.id, 'cid', v);
                }}
                style={{ padding: 4, width: 120 }} /></td>
              <td>
                <button onClick={() => delEmployee(emp.id)} style={{
                  background: 'red', color: '#fff', border: 'none', padding: '4px 8px'
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Materials</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Material name" value={newMaterial} onChange={e => setNewMaterial(e.target.value)}
          style={{ padding: 6, width: 200 }} />
        <button onClick={addMaterial} style={{
          padding: '6px 12px', background: '#d1b07b', border: 'none', color: '#000'
        }}>Add</button>
      </div>

      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Material</th>
            <th style={{ width: 30 }}></th>
          </tr>
        </thead>
        <tbody>
          {materials.map(mat => (
            <tr key={mat.id}>
              <td>{mat.name}</td>
              <td>
                <button onClick={() => delMaterial(mat.id)} style={{
                  background: 'red', color: '#fff', border: 'none', padding: '4px 8px'
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
