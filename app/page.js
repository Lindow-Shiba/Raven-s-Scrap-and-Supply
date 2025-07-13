"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const priceMap = {
  Aluminium: 15.0,
  "Rusted Metal": 10.0,
  // Add all your materials here with prices
};

export default function Page() {
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState(1);

  const addToCart = () => {
    if (!newItem || newQty < 1) return;
    setCart((prev) => {
      const exists = prev.find((item) => item.name === newItem);
      if (exists) {
        return prev.map((item) =>
          item.name === newItem
            ? { ...item, qty: item.qty + newQty }
            : item
        );
      }
      return [...prev, { name: newItem, qty: newQty }];
    });
  };

  const download = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    let totalPrice = 0;
    const lines = cart.map(({ name, qty }) => {
      const unitPrice = priceMap[name] || 0;
      const itemTotal = unitPrice * qty;
      totalPrice += itemTotal;
      return `• **${name}** × ${qty} ($${unitPrice.toFixed(2)} each) — $${itemTotal.toFixed(2)}`;
    });

    const embed = {
      title: "Invoice Submission",
      color: 0x00b0f4,
      fields: [
        {
          name: "Items",
          value: lines.join("\n"),
        },
        {
          name: "Total Price",
          value: `$${totalPrice.toFixed(2)}`,
        },
      ],
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (res.ok) {
        alert("Invoice submitted!");
      } else {
        alert("Failed to submit invoice.");
      }
    } catch (error) {
      console.error("Failed to send to Discord:", error);
      alert("Error submitting invoice.");
    }
  };

  return (
    <main>
      <div>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Item name"
        />
        <input
          type="number"
          value={newQty}
          min="1"
          onChange={(e) => setNewQty(Number(e.target.value))}
        />
        <button onClick={addToCart}>Add</button>
      </div>

      <ul>
        {cart.map(({ name, qty }) => (
          <li key={name}>
            {name} × {qty}
          </li>
        ))}
      </ul>

      <button onClick={download}>Submit Invoice</button>
    </main>
  );
}
