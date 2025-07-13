'use client';

import React, { useState, useEffect } from 'react';

const priceMap = {
  Aluminium: 15,
  Battery: 50,
  // add other materials and prices here...
};

export default function ClientPage() {
  const [items, setItems] = useState([
    { name: 'Aluminium', qty: 0 },
    { name: 'Battery', qty: 0 },
    // add other materials here...
  ]);

  const [invoiceId, setInvoiceId] = useState('INV-001');

  const handleQtyChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].qty = parseInt(qty) || 0;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const filteredItems = items.filter(i => i.qty > 0);
    const lines = filteredItems.map(i => `${i.name} × ${i.qty} - $${(priceMap[i.name] * i.qty).toFixed(2)}`);
    const total = filteredItems.reduce((sum, i) => sum + priceMap[i.name] * i.qty, 0).toFixed(2);

    try {
      const res = await fetch('/api/submitInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inv: invoiceId, lines, total }),
      });
      if (!res.ok) throw new Error('Failed to submit invoice');
      alert('Invoice submitted');
    } catch (err) {
      alert('Invoice submitted, but Discord notification failed.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Submit Invoice</h1>
      {items.map((item, idx) => (
        <div key={item.name}>
          <label>{item.name}</label>
          <input
            type="number"
            min="0"
            value={item.qty}
            onChange={e => handleQtyChange(idx, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Invoice</button>
      <div>
        <h2>Total: ${items.reduce((sum, i) => sum + (priceMap[i.name] * i.qty), 0).toFixed(2)}</h2>
      </div>
    </div>
  );
}
