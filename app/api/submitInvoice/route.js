
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { inv, lines, total } = await request.json();

    if (!inv || !lines || !total) {
      console.error('Missing required fields:', { inv, lines, total });
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const payload = {
      embeds: [
        {
          title: `Invoice ${inv}`,
          color: 0x00b0f4,
          fields: [
            { name: 'Items', value: lines.join('\n') || '-' },
            { name: 'Total', value: `$${total}`, inline: true }
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
    console.error('API error in submitInvoice:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
