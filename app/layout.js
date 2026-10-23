import { Playfair_Display, Source_Serif_4, Inter } from 'next/font/google';
import Link from 'next/link';
import TV from '@/components/TV';
import { listArticles } from '@/lib/db';
import './globals.css';

const display = Playfair_Display({ subsets: ['latin'], variable: '--display', weight: ['500', '700', '800'] });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--serif' });
const sans = Inter({ subsets: ['latin'], variable: '--sans' });

const site = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(site),
  openGraph: { siteName: 'Finance Feed', type: 'website' },
  title: { default: 'Finance Feed | Equity Research & Market Commentary', template: '%s | Finance Feed' },
  description: 'Independent equity research, financial analysis and market commentary.',
};
export const dynamic = 'force-dynamic';

const tape = {
  symbols: [
    { proName: 'BSE:SENSEX', title: 'Sensex' },
    { proName: 'NSE:NIFTY', title: 'Nifty 50' },
    { proName: 'NSE:BANKNIFTY', title: 'Bank Nifty' },
    { proName: 'FX_IDC:USDINR', title: 'USD/INR' },
    { proName: 'TVC:GOLD', title: 'Gold' },
    { proName: 'TVC:UKOIL', title: 'Brent' },
    { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
    { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  ],
  showSymbolLogo: false, colorTheme: 'dark', isTransparent: false, displayMode: 'adaptive', locale: 'en',
};

export default async function RootLayout({ children }) {
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });
  const arts = await listArticles(false);
  const cats = [...new Set(arts.map((a) => a.category))].slice(0, 6);
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body>
        <TV type="ticker-tape" config={tape} height={46} />
        <header className="mast">
          <div className="wrap mast-in">
            <Link href="/" className="brand">
              <span className="mono">FF</span>
              <span className="name">Finance Feed</span>
            </Link>
            <nav className="nav">
              <Link href="/">Latest</Link>
              {cats.map((c) => <Link key={c} href={`/?c=${encodeURIComponent(c)}`}>{c}</Link>)}
            </nav>
          </div>
        </header>
        <div className="datebar"><div className="wrap"><span>{date}</span><span>Equity research and market commentary</span></div></div>
        <main className="wrap">{children}</main>
        <footer className="foot">
          <div className="wrap foot-in">
            <div>
              <div className="foot-brand">Finance Feed</div>
              <p>Content on Finance Feed is published for informational and educational purposes only. It is not investment advice or a recommendation to buy or sell any security. Market data is provided by TradingView and may be delayed.</p>
            </div>
            <div className="foot-r">
              <span>&copy; {new Date().getFullYear()} Finance Feed</span>
              <Link href="/admin" className="lock" aria-label="Editor sign in" title="Editor">&#9679;</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
