import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { inv, lines, total } = await request.json();

const payload = {
  embeds: [
    {
      title: `Invoice ${inv}`,
      color: 0x00b0f4,
      fields: [
        { name: 'Employee', value: inv.employee || '—', inline: true },
        { name: 'Warehouse', value: inv.warehouse || '—', inline: true },
        { name: 'Date', value: new Date().toLocaleString(), inline: false },
        { name: 'Items', value: lines.join('\n') || '—', inline: false },
        { name: 'Total', value: `$${total.toFixed(2)}`, inline: false }
      ],
      timestamp: new Date().toISOString()
    }
  ]
};


    const discordRes = await fetch(process.env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!discordRes.ok) {
      console.error('Discord responded with status', discordRes.status);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('API error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
