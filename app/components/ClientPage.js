'use client';

import React, { useState } from 'react';

const materialGroups = {
  'Car Internals': [
    'Axle Parts',
    'Body Repair Tools',
    'Brake Pads',
    'Clutch Kits',
    'Fuel Straps',
    'Radiator Part',
    'Suspension Parts',
    'Tire Repair Kit',
    'Transmission Parts',
    'Wires',
  ],
  Materials: [
    'Aluminium',
    'Battery',
    'Carbon',
    'Clutch Fluid',
    'Coil Spring',
    'Copper',
    'Copper Wires',
    'Electronics',
    'Graphite',
    'Iron',
    'Laminated Plastic',
    'Lead',
    'Multi-Purpose Grease',
    'Paint Thinner',
    'Plastic',
    'Polymer',
    'Polyethylene',
    'Rubber',
    'Rusted Metal',
    'Scrap Metal',
    'Silicone',
    'Stainless Steel',
    'Steel',
    'Timing Belt',
    'Gun Powder',
    'Iron Ore',
  ],
  'Extra Items': [
    'Apple Phone',
    'Adv Lockpick',
    'Bottle Cap',
    'Deformed Nail',
    'Empty Bottle Glass',
    'Horse Shoe',
    'Leather',
    'Lockpick',
    'Old Coin',
    'Pork & Beans',
    'Repair Kit',
    'Rusted Lighter',
    'Rusted Tin Can',
    'Rusted Watch',
    'Samsung Phone',
  ],
};

const priceMap = {
  Aluminium: 15,
  Battery: 25,
  Carbon: 12,
  'Clutch Fluid': 8,
  'Coil Spring': 10,
  Copper: 20,
  // Add the rest of prices as you need
};

export default function ClientPage() {
  const [receiptItems, setReceiptItems] = useState([]);
  const [invoiceId, setInvoiceId] = useState('07-13-2025-001');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [invoicePreview, setInvoicePreview] = useState(null);

  const addItemToReceipt = (item) => {
    setReceiptItems((prev) => {
      const found = prev.find((i) => i.name === item);
      if (found) {
        return prev.map((i) => (i.name === item ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { name: item, qty: 1 }];
    });
  };

  const updateQty = (name, qty) => {
    setReceiptItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, qty: Number(qty) || 0 } : item
      )
    );
  };

  const total = receiptItems.reduce(
    (acc, i) => acc + (priceMap[i.name] || 0) * i.qty,
    0
  );

  const handleSubmit = async () => {
    if (!name || !warehouse) {
      alert('Please select your name and warehouse.');
      return;
    }
    if (receiptItems.length === 0) {
      alert('No items in invoice.');
      return;
    }

    const filteredItems = receiptItems.filter((i) => i.qty > 0);
    if (filteredItems.length === 0) {
      alert('Please enter quantity for at least one item.');
      return;
    }

    const lines = filteredItems.map(
      (i) => `${i.name} × ${i.qty} - $${((priceMap[i.name] || 0) * i.qty).toFixed(2)}`
    );

    const payload = {
      embeds: [
        {
          title: `Invoice ${invoiceId}`,
          color: 0xd4af37,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Warehouse', value: warehouse, inline: true },
            { name: 'Notes', value: notes || '-', inline: false },
            { name: 'Items', value: lines.join('\n'), inline: false },
            { name: 'Total', value: `$${total.toFixed(2)}`, inline: false },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setInvoicePreview({
      id: invoiceId,
      lines,
      total: total.toFixed(2),
      name,
      warehouse,
      notes,
    });

    try {
      const res = await fetch('/api/submitInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert('Invoice submitted, but Discord notification failed.');
      } else {
        alert('Invoice submitted successfully!');
        setReceiptItems([]);
        setNotes('');
        setName('');
        setWarehouse('');
        // Optionally increment invoiceId here
      }
    } catch (error) {
      alert('Error submitting invoice.');
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        padding: 20,
        color: '#FFD700',
        backgroundColor: '#000',
        minHeight: '80vh',
      }}
    >
      {/* Left side: Receipt and form */}
      <div style={{ flex: 1, paddingRight: 20 }}>
        <h2>Receipt & Invoice</h2>

        <div
          style={{
            backgroundColor: '#111',
            padding: 15,
            borderRadius: 5,
            minHeight: 200,
            marginBottom: 15,
            color: '#fff',
          }}
        >
          {receiptItems.length === 0 ? (
            <p>No items added yet.</p>
          ) : (
            receiptItems.map(({ name, qty }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span>{name}</span>
                <input
                  type="number"
                  min="0"
                  value={qty}
                  onChange={(e) => updateQty(name, e.target.value)}
                  style={{ width: 50 }}
                />
                <span>
                  $
                  {((priceMap[name] || 0) * qty).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Name:
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginLeft: 10, padding: 5, width: '60%' }}
            >
              <option value="">Select your name</option>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Warehouse:
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              style={{ marginLeft: 10, padding: 5, width: '60%' }}
            >
              <option value="">Select warehouse</option>
              <option value="Warehouse A">Warehouse A</option>
              <option value="Warehouse B">Warehouse B</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Invoice ID:
            <input
              type="text"
              value={invoiceId}
              readOnly
              style={{ marginLeft: 10, padding: 5, width: '60%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ marginLeft: 10, padding: 5, width: '100%', minHeight: 60 }}
              placeholder="Add any notes here..."
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            backgroundColor: '#D4AF37',
            border: 'none',
            padding: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Submit Invoice
        </button>
      </div>

      {/* Right side: Material buttons */}
      <div style={{ flex: 2 }}>
        {Object.entries(materialGroups).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 20 }}>
            <h3>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {items.map((item) => (
                <button
                  key={item}
                  style={{
                    backgroundColor: '#d4af37',
                    border: 'none',
                    borderRadius: 3,
                    padding: '6px 12px',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => addItemToReceipt(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
