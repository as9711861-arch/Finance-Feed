import Link from 'next/link';
import TV from '@/components/TV';
import { listArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

const fmt = (t) => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const overview = {
  colorTheme: 'light', dateRange: '12M', showChart: true, locale: 'en', width: '100%', height: 520,
  isTransparent: false, showSymbolLogo: false, showFloatingTooltip: false,
  plotLineColorGrowing: 'rgba(11, 31, 58, 1)', plotLineColorFalling: 'rgba(122, 28, 28, 1)',
  gridLineColor: 'rgba(240, 243, 250, 0)', scaleFontColor: 'rgba(120, 123, 134, 1)',
  belowLineFillColorGrowing: 'rgba(11, 31, 58, 0.08)', belowLineFillColorFalling: 'rgba(122, 28, 28, 0.08)',
  belowLineFillColorGrowingBottom: 'rgba(11, 31, 58, 0)', belowLineFillColorFallingBottom: 'rgba(122, 28, 28, 0)',
  symbolActiveColor: 'rgba(11, 31, 58, 0.08)',
  tabs: [
    { title: 'India', symbols: [{ s: 'BSE:SENSEX', d: 'Sensex' }, { s: 'NSE:NIFTY', d: 'Nifty 50' }, { s: 'NSE:BANKNIFTY', d: 'Bank Nifty' }, { s: 'NSE:CNXIT', d: 'Nifty IT' }] },
    { title: 'Global', symbols: [{ s: 'FOREXCOM:SPXUSD', d: 'S&P 500' }, { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' }, { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100' }, { s: 'INDEX:NKY', d: 'Nikkei 225' }] },
    { title: 'Commodities', symbols: [{ s: 'TVC:GOLD', d: 'Gold' }, { s: 'TVC:SILVER', d: 'Silver' }, { s: 'TVC:UKOIL', d: 'Brent' }, { s: 'FX_IDC:USDINR', d: 'USD/INR' }] },
  ],
};

export default async function Home() {
  const all = await listArticles(false);
  const [lead, ...rest] = all;
  return (
    <div className="grid">
      <section>
        {!lead && <p className="empty">Abhi koi article publish nahi hua hai.</p>}
        {lead && (
          <article className="lead">
            {lead.cover && <Link href={`/article/${lead.id}`}><img src={lead.cover} alt="" /></Link>}
            <div className="cat">{lead.category}</div>
            <h1><Link href={`/article/${lead.id}`}>{lead.title}</Link></h1>
            <p className="dek">{lead.dek}</p>
            <div className="meta">{fmt(lead.createdAt)}</div>
          </article>
        )}
        <div className="list">
          {rest.map((a) => (
            <article key={a.id} className="row">
              <div>
                <div className="cat">{a.category}</div>
                <h3><Link href={`/article/${a.id}`}>{a.title}</Link></h3>
                <p className="dek">{a.dek}</p>
                <div className="meta">{fmt(a.createdAt)}</div>
              </div>
              {a.cover && <Link href={`/article/${a.id}`}><img src={a.cover} alt="" /></Link>}
            </article>
          ))}
        </div>
      </section>
      <aside>
        <h4 className="side-h">Markets</h4>
        <TV type="market-overview" config={overview} height={520} />
      </aside>
    </div>
  );
}
