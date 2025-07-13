'use client';

import { useState } from 'react';

const materialGroups = {
  'Car Internals': ['Axle Parts', 'Body Repair Tools', 'Brake Pads', 'Clutch Kits', 'Fuel Straps', 'Radiator Part', 'Suspension Parts', 'Tire Repair Kit', 'Transmission Parts', 'Wires'],
  Materials: ['Aluminium', 'Battery', 'Carbon', 'Clutch Fluid', 'Coil Spring', 'Copper', 'Copper Wires', 'Electronics', 'Graphite', 'Iron', 'Laminated Plastic', 'Lead', 'Multi-Purpose Grease', 'Paint Thinner', 'Plastic', 'Polymer', 'Polyethylene', 'Rubber', 'Rusted Metal', 'Scrap Metal', 'Silicone', 'Stainless Steel', 'Steel', 'Timing Belt', 'Gun Powder', 'Iron Ore'],
  'Extra Items': ['Apple Phone', 'Adv Lockpick', 'Bottle Cap', 'Deformed Nail', 'Empty Bottle Glass', 'Horse Shoe', 'Leather', 'Lockpick', 'Old Coin', 'Pork & Beans', 'Repair Kit', 'Rusted Lighter', 'Rusted Tin Can', 'Rusted Watch', 'Samsung Phone']
};

export default function Page() {
  const [receiptItems, setReceiptItems] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceId, setInvoiceId] = useState('07-13-2025-001');

  const addItemToReceipt = (item) => {
    setReceiptItems(prev => {
      const found = prev.find(i => i.name === item);
      if (found) {
        return prev.map(i => i.name === item ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { name: item, qty: 1 }];
    });
  };

  const total = receiptItems.reduce((acc, i) => acc + (i.qty * 15), 0); // Example $15 per item

  return (
    <>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <h2>Receipt</h2>
        <div style={{ backgroundColor: '#111', padding: '10px', borderRadius: '5px', minHeight: '300px', color: '#fff' }}>
          {receiptItems.length === 0 ? (
            <p>No items added yet</p>
          ) : (
            receiptItems.map(({ name, qty }) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>{name}</span>
                <span>{qty}</span>
              </div>
            ))
          )}
        </div>

        {/* Input form for name, warehouse, notes, invoice id */}
        <div style={{ marginTop: '20px' }}>
          <select value={selectedName} onChange={e => setSelectedName(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="">Select your Name</option>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
          </select>
          <select value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="">Select Warehouse</option>
            <option value="Warehouse A">Warehouse A</option>
            <option value="Warehouse B">Warehouse B</option>
          </select>
          <input type="text" value={invoiceId} readOnly style={{ width: '100%', marginBottom: '10px', padding: '5px' }} />
          <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '5px' }} />

          <button style={{ width: '100%', backgroundColor: '#D4AF37', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Download Invoice
          </button>
        </div>
      </div>

      <div style={{ flex: 2 }}>
        {Object.entries(materialGroups).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '20px' }}>
            <h3>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {items.map(item => (
                <button
                  key={item}
                  style={{
                    backgroundColor: '#d4af37',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold'
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
    </>
  );
}
