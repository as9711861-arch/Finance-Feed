import Link from 'next/link';
import TV from '@/components/TV';
import { listArticles } from '@/lib/db';
import { readTime } from '@/lib/util';

export const dynamic = 'force-dynamic';

const fmt = (t) => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const overview = {
  colorTheme: 'light', dateRange: '12M', showChart: true, locale: 'en', width: '100%', height: 540,
  isTransparent: false, showSymbolLogo: false, showFloatingTooltip: false,
  plotLineColorGrowing: 'rgba(10, 27, 51, 1)', plotLineColorFalling: 'rgba(161, 38, 38, 1)',
  gridLineColor: 'rgba(240, 243, 250, 0)', scaleFontColor: 'rgba(91, 101, 115, 1)',
  belowLineFillColorGrowing: 'rgba(10, 27, 51, 0.08)', belowLineFillColorFalling: 'rgba(161, 38, 38, 0.08)',
  belowLineFillColorGrowingBottom: 'rgba(10, 27, 51, 0)', belowLineFillColorFallingBottom: 'rgba(161, 38, 38, 0)',
  symbolActiveColor: 'rgba(10, 27, 51, 0.08)',
  tabs: [
    { title: 'India', symbols: [{ s: 'BSE:SENSEX', d: 'Sensex' }, { s: 'BSE:BANKEX', d: 'Bankex' }, { s: 'BSE:SENSEX50', d: 'Sensex 50' }, { s: 'FX_IDC:USDINR', d: 'USD/INR' }] },
    { title: 'Global', symbols: [{ s: 'FOREXCOM:SPXUSD', d: 'S&P 500' }, { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' }, { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100' }, { s: 'INDEX:NKY', d: 'Nikkei 225' }] },
    { title: 'Commodities', symbols: [{ s: 'TVC:GOLD', d: 'Gold' }, { s: 'TVC:SILVER', d: 'Silver' }, { s: 'TVC:UKOIL', d: 'Brent' }, { s: 'FX_IDC:USDINR', d: 'USD/INR' }] },
  ],
};

export default async function Home({ searchParams }) {
  const { c } = await searchParams;
  const all = await listArticles(false);
  const cats = [...new Set(all.map((a) => a.category))];
  const shown = c ? all.filter((a) => a.category === c) : all;
  const [lead, ...rest] = shown;

  return (
    <>
      {c && <h1 className="topic">{c}</h1>}
      {!lead && <p className="empty">No articles have been published yet. Please check back soon.</p>}
      {lead && (
        <section className="hero">
          {lead.cover && <img className="hero-bg" src={lead.cover} alt="" />}
          <div className="hero-shade" />
          <div className="hero-txt">
            <div className="cat">{lead.category}</div>
            <h1><Link href={`/article/${lead.id}`}>{lead.title}</Link></h1>
            {lead.dek && <p className="dek">{lead.dek}</p>}
            <div className="hero-foot">
              <span className="meta">{fmt(lead.createdAt)}</span>
              <span className="meta">{readTime(lead.body)} min read</span>
              <Link href={`/article/${lead.id}`} className="readmore">Read the analysis</Link>
            </div>
          </div>
        </section>
      )}
      <div className="grid">
        <section>
          {rest.length > 0 && <h2 className="sec">{c ? 'More in this section' : 'Latest analysis'}</h2>}
          <div className="cards">
            {rest.map((a) => (
              <article key={a.id} className="card">
                {a.cover && <Link href={`/article/${a.id}`} className="card-img"><img src={a.cover} alt="" /></Link>}
                <div className="card-b">
                  <div className="cat">{a.category}</div>
                  <h3><Link href={`/article/${a.id}`}>{a.title}</Link></h3>
                  {a.dek && <p className="dek">{a.dek}</p>}
                  <div className="meta two"><span>{fmt(a.createdAt)}</span><span>{readTime(a.body)} min read</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <aside>
          <div className="panel">
            <h2 className="sec">Markets</h2>
            <TV type="market-overview" config={overview} height={540} />
          </div>
          {cats.length > 0 && (
            <div className="panel topics">
              <h2 className="sec">Topics</h2>
              {cats.map((x) => <Link key={x} href={`/?c=${encodeURIComponent(x)}`}>{x}</Link>)}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
