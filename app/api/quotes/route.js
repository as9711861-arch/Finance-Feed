import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LIST = [
  ['Nifty 50', '^NSEI'], ['Bank Nifty', '^NSEBANK'], ['Sensex', '^BSESN'], ['USD/INR', 'INR=X'],
  ['Gold', 'GC=F'], ['Brent', 'BZ=F'], ['S&P 500', '^GSPC'], ['Bitcoin', 'BTC-USD'],
];

async function one([name, sym]) {
  const r = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`,
    { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 30 } }
  );
  if (!r.ok) throw new Error(String(r.status));
  const m = (await r.json()).chart.result[0].meta;
  const price = m.regularMarketPrice;
  const prev = m.chartPreviousClose ?? m.previousClose;
  if (typeof price !== 'number' || typeof prev !== 'number') throw new Error('bad data');
  return { name, price, change: price - prev, pct: ((price - prev) / prev) * 100 };
}

export async function GET() {
  const res = await Promise.allSettled(LIST.map(one));
  const data = res.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
}
