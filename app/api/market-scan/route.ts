import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Sorgu bulunamadı' }, { status: 400 });
    }

    const response = await fetch('https://google.serper.dev/shopping', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_SERPER_API_KEY || '',
        'Content-Type': 'application/json',
      },
      // gl: 'tr' ve hl: 'tr' ile Türkiye sonuçlarını ve dilini garantiliyoruz
      body: JSON.stringify({ q: query, gl: 'tr', hl: 'tr' }),
    });

    const data = await response.json();
    const shoppingResults = data.shopping || [];

    if (shoppingResults.length === 0) {
      return NextResponse.json({ message: 'Ürün bulunamadı' }, { status: 404 });
    }

    // FİYAT AYIKLAMA VE EN UCUZU BULMA MOTORU
    const sorted = shoppingResults.sort((a: any, b: any) => {
      const cleanPrice = (priceStr: string) => {
        if (!priceStr) return Infinity;
        return parseFloat(
          priceStr
            .replace(/\./g, '') // Binlik ayıracı olan noktayı kaldır (1.250 -> 1250)
            .replace(',', '.')  // Ondalık virgülünü noktaya çevir (1250,50 -> 1250.50)
            .replace(/[^\d.]/g, '') // Rakam ve nokta dışındaki her şeyi (TL, $, vb.) sil
        ) || Infinity;
      };

      return cleanPrice(a.price) - cleanPrice(b.price);
    });

    // En ucuz ürünü (sorted[0]) döndür
    return NextResponse.json(sorted[0]);

  } catch (error) {
    console.error('Serper API Hatası:', error);
    return NextResponse.json({ error: 'Tarama sırasında bir hata oluştu' }, { status: 500 });
  }
}