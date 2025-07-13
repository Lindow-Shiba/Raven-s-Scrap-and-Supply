// app/page.js
'use client';

import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/* ───────────────────────────────────────────────────────────────
   1.  CONFIG  ─────────────────────────────────────────────────── */
const DISCORD_WEBHOOK = 'YOUR_DISCORD_WEBHOOK_URL_HERE'; // ← put your webhook URL here

const catalogue = {
  'Car Internals': [
    'Axle Parts', 'Body Repair Tools', 'Brake Pads', 'Clutch Kits', 'Fuel Straps',
    'Radiator Part', 'Suspension Parts', 'Tire Repair Kit', 'Transmission Parts', 'Wires'
  ],
  'Materials': [
    'Aluminium', 'Battery', 'Carbon', 'Clutch Fluid', 'Coil Spring', 'Copper',
    'Copper Wires', 'Electronics', 'Graphite', 'Iron', 'Laminated Plastic', 'Lead',
    'Multi-Purpose Grease', 'Paint Thinner', 'Plastic', 'Polymer', 'Polyethylene',
    'Rubber', 'Rusted Metal', 'Scrap Metal', 'Silicone', 'Stainless Steel', 'Steel',
    'Timing Belt', 'Gun Powder', 'Iron Ore'
  ],
  'Extra Items': [
    'Apple Phone', 'Adv Lockpick', 'Bottle Cap', 'Deformed Nail', 'Empty Bottle Glass',
    'Horse Shoe', 'Leather', 'Lockpick', 'Old Coin', 'Pork & Beans', 'Repair Kit',
    'Rusted Lighter', 'Rusted Tin Can', 'Rusted Watch', 'Samsung Phone'
  ]
};

/* ───────────────────────────────────────────────────────────────
   2.  MAIN COMPONENT  ─────────────────────────────────────────── */
export default function Home() {
  const [page, setPage]   = useState('materials');
  const [cart, setCart]   = useState({});
  const [names, setNames] = useState([]);

  const [who, setWho] = useState('');
  const [wh,  setWh]  = useState('');

  const todayUS = () => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
  };
  const [inv,   setInv]   = useState(`${todayUS()}-001`);
  const [notes, setNotes] = useState('');

  /* Fetch employee names once */
  useEffect(() => {
    supabase.from('employees')
      .select('name')
      .order('name')
      .then(({ data }) => setNames(data?.map(r => r.name) || []));
  }, []);

  /* Helpers to mutate cart */
  const add   = id  => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const del   = id  => setCart(({ [id]: _, ...r }) => r);
  const setQty = (id, q) => setCart(c => (q > 0 ? { ...c, [id]: q } : { ...c, [id]: undefined }));

  /* ───────────────────────────────────────────────────────────
     3.  DOWNLOAD & WEBHOOK  ─────────────────────────────────── */
  const download = async () => {
    /* 3-a.  Capture the receipt PNG */
    const el = document.getElementById('left-panel');
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#fff' });
    const link   = document.createElement('a');
    link.href     = canvas.toDataURL('image/png');
    link.download = `${inv}.png`;
    link.click();

    /* 3-b.  Build item summary */
    const cartEntries = Object.entries(cart).filter(([, q]) => q > 0);
    const summary = cartEntries
      .map(([item, q]) => `• **${item}** × ${q}`)
      .join('\n') || 'No items';

    /* 3-c.  Fetch live prices & total */
    let totalValue = 0;
    if (cartEntries.length) {
      const { data: prices, error } = await supabase
        .from('materials')
        .select('name, price');

      if (!error) {
        for (const [name, qty] of cartEntries) {
          const row = prices.find(p => p.name === name);
          if (row) totalValue += row.price * qty;
        }
      } else {
        console.error('Price lookup failed', error);
      }
    }

    /* 3-d.  Post to Discord */
    fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Raven Invoices',
        embeds: [{
          title: `Invoice ${inv}`,
          color: 0xd1b07b,
          fields: [
            { name: 'Employee',  value: who || '—', inline: true },
            { name: 'Warehouse', value: wh  || '—', inline: true },
            { name: 'Date',      value: new Date().toLocaleString(), inline: false },
            { name: 'Items',     value: summary, inline: false },
            { name: 'Total Price', value: `$${totalValue.toLocaleString(
