import React, { useState, useEffect } from 'react';

export default function ClientPage() {
  const [items, setItems] = useState([
    // Example items - replace with your real data or fetch from Supabase
    { name: 'Aluminium', qty: 0 },
    { name: 'Rusted Metal', qty: 0 },
  ]);
  const [priceMap, setPriceMap] = useState({});
  const [invoiceId, setInvoiceId] = useState('INV-001');

  useEffect(() => {
    // Fetch prices from Supabase or set manually
    setPriceMap({
      Aluminium: 15.0,
      'Rusted Metal': 10.0,
    });
  }, []);

  const submitInvoice = async () => {
    const lines = items
      .filter(i => i.qty > 0)
      .map(
        i =>
          `${i.name} × ${i.qty} - $${(
            (priceMap[i.name] || 0) * i.qty
          ).toFixed(2)}`
      );

    const total = items
      .reduce(
        (sum, i) => sum + (priceMap[i.name] || 0) * i.qty,
        0
      )
      .toFixed(2);

    try {
      const res = await fetch('/api/submitInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inv: invoiceId, lines, total }),
      });

      if (res.ok) {
        alert('Invoice submitted!');
      } else {
        alert('Failed to submit invoice.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting invoice.');
    }
  };

  return (
    <div>
      <h1>Invoice Form</h1>
      {items.map((item, idx) => (
        <div key={idx}>
          <label>
            {item.name} Qty:{' '}
            <input
              type="number"
              value={item.qty}
              min="0"
              onChange={e => {
                const newQty = parseInt(e.target.value, 10) || 0;
                setItems(prev =>
                  prev.map((it, i) =>
                    i === idx ? { ...it, qty: newQty } : it
                  )
                );
              }}
            />
          </label>
        </div>
      ))}
      <button onClick={submitInvoice}>Submit Invoice</button>
    </div>
  );
}
