
'use client';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  category: 'Car Internals' | 'Materials' | 'Extra Items';
}

const ITEMS: Item[] = [
  // Car Internals
  { id: 'axle_parts', name: 'Axle Parts', category: 'Car Internals' },
  { id: 'body_repair_tools', name: 'Body Repair Tools', category: 'Car Internals' },
  { id: 'brake_pads', name: 'Brake Pads', category: 'Car Internals' },
  { id: 'clutch_kits', name: 'Clutch Kits', category: 'Car Internals' },
  { id: 'fuel_straps', name: 'Fuel Straps', category: 'Car Internals' },
  { id: 'radiator_part', name: 'Radiator Part', category: 'Car Internals' },
  { id: 'suspension_parts', name: 'Suspension Parts', category: 'Car Internals' },
  { id: 'tire_repair_kit', name: 'Tire Repair Kit', category: 'Car Internals' },
  { id: 'transmission_parts', name: 'Transmission Parts', category: 'Car Internals' },
  { id: 'wires', name: 'Wires', category: 'Car Internals' },

  // Materials
  'Aluminium,Battery,Carbon,Clutch Fluid,Coil Spring,Copper,Copper Wires,Electronics,Graphite,Iron,Laminated Plastic,Lead,Multi-Purpose Grease,Paint Thinner,Plastic,Polymer,Polyethylene,Rubber,Rusted Metal,Scrap Metal,Silicone,Stainless Steel,Steel,Timing Belt,Gun Powder,Iron Ore'
    .split(',')
    .map(n => n.trim())
    .map(name => ({ id: name.toLowerCase().replace(/\s+/g,'_'), name, category: 'Materials' })),

  // Extra Items
  'Apple Phone,Adv Lockpick,Bottle Cap,Deformed Nail,Empty Bottle Glass,Horse Shoe,Leather,Lockpick,Old Coin,Pork & Beans,Repair Kit,Rusted Lighter,Rusted Tin Can,Rusted Watch,Samsung Phone'
    .split(',')
    .map(n => n.trim())
    .map(name => ({ id: name.toLowerCase().replace(/\s+/g,'_'), name, category: 'Extra Items' })),
].flat();

const CultureShock: React.FC = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [employees, setEmployees] = useState<string[]>(['John Doe', 'Jane Smith']);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [warehouse, setWarehouse] = useState<'AE' | 'CNC' | ''>('');

  const addToCart = (id: string) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(({ [id]: _, ...rest }) => rest);

  const downloadReceipt = async () => {
    const el = document.getElementById('receipt');
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `invoice-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-[#d1b07b] p-4 font-['Montserrat']">
      <Tabs defaultValue="invoice">
        <TabsList className="mb-6 gap-4">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        {/* Invoice */}
        <TabsContent value="invoice">
          <div className="grid lg:grid-cols-[350px_1fr] gap-4">
            {/* Receipt */}
            <div className="border-r border-[#d1b07b]/50 pr-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
              <h2 className="text-xl font-bold mb-4">Receipt</h2>

              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-black">
                  <tr className="text-left"><th>Item</th><th>Qty</th><th/></tr>
                </thead>
                <tbody>
                  {Object.entries(cart).map(([id, qty]) => {
                    const name = ITEMS.find(i => i.id===id)?.name || id;
                    return (
                      <tr key={id}>
                        <td>{name}</td>
                        <td>{qty}</td>
                        <td>
                          <button onClick={()=>removeFromCart(id)} aria-label="delete"><Trash2 size={14}/></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Controls */}
              <div className="mt-6 flex flex-col gap-3">
                <select value={selectedEmployee} onChange={e=>setSelectedEmployee(e.target.value)} className="bg-transparent border border-[#d1b07b] p-2 rounded">
                  <option value="">Select your Name</option>
                  {employees.map(emp=><option key={emp}>{emp}</option>)}
                </select>

                <select value={warehouse} onChange={e=>setWarehouse(e.target.value as 'AE'|'CNC')} className="bg-transparent border border-[#d1b07b] p-2 rounded">
                  <option value="">Select Warehouse</option>
                  <option value="AE">AE</option>
                  <option value="CNC">CNC</option>
                </select>

                <Input placeholder="Invoice # xx-xxxxxx" className="border-[#d1b07b]"/>
                <Input placeholder="Notes" className="border-[#d1b07b]"/>
                <Button className="bg-[#d1b07b] text-black" onClick={downloadReceipt}>Post Invoice & Download</Button>
              </div>

              {/* hidden receipt */}
              <div id="receipt" className="sr-only p-4 text-black">
                <h3 className="font-bold mb-2">Culture Shock Invoice</h3>
                <p>Employee: {selectedEmployee}</p>
                <p>Warehouse: {warehouse}</p>
                <table className="mt-2 w-full text-sm"><tbody>
                  {Object.entries(cart).map(([id, qty])=>{
                    const name = ITEMS.find(i=>i.id===id)?.name || id;
                    return <tr key={id}><td>{name}</td><td>{qty}</td></tr>;
                  })}
                </tbody></table>
              </div>
            </div>

            {/* Catalogue */}
            <div className="overflow-y-auto" style={{ maxHeight: '75vh' }}>
              {(['Car Internals','Materials','Extra Items'] as const).map(cat=>(
                <div key={cat} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{cat}</h2>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
                    {ITEMS.filter(i=>i.category===cat).map(item=>(
                      <button key={item.id} onClick={()=>addToCart(item.id)} className="bg-[#d1b07b] text-black p-3 rounded hover:scale-105 transition text-xs leading-tight">
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Employees */}
        <TabsContent value="employees">
          <h2 className="text-2xl font-bold mb-4">Manage Employees</h2>
          <div className="max-w-sm flex flex-col gap-3">
            <Input id="empName" placeholder="New employee name" className="border-[#d1b07b]"/>
            <Button className="bg-[#d1b07b] text-black" onClick={()=>{
              const input=document.getElementById('empName') as HTMLInputElement;
              const name=input.value.trim();
              if(name && !employees.includes(name)){ setEmployees([...employees,name]); input.value=''; }
            }}>Add Employee</Button>
            <ul className="list-disc ml-5">
              {employees.map(emp=><li key={emp}>{emp}</li>)}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CultureShock;
