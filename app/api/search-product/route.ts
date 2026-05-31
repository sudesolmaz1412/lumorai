import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { query } = await req.json();

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY || '', // .env dosyana eklemelisin
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: `${query} fiyatı en hızlı teslimat`,
        gl: 'tr',
        hl: 'tr',
        num: 3
      }),
    });

    const data = await response.json();
    return NextResponse.json(data.organic);
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}