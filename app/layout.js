import { Playfair_Display, Source_Serif_4, Inter } from 'next/font/google';
import Link from 'next/link';
import TV from '@/components/TV';
import './globals.css';

const display = Playfair_Display({ subsets: ['latin'], variable: '--display', weight: ['600', '800'] });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--serif' });
const sans = Inter({ subsets: ['latin'], variable: '--sans' });

export const metadata = {
  title: 'Finance Feed',
  description: 'Equity research, market commentary and analysis.',
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

export default function RootLayout({ children }) {
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body>
        <TV type="ticker-tape" config={tape} height={46} />
        <header className="mast">
          <div className="wrap">
            <div className="dateline">{date}</div>
            <Link href="/" className="logo">Finance Feed</Link>
            <div className="tag">Equity research &amp; market commentary</div>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">
          <div className="wrap">
            <span>© {new Date().getFullYear()} Finance Feed. Sirf educational purpose ke liye; investment advice nahi.</span>
            <Link href="/admin" className="lock" aria-label="Editor login" title="Editor">&#9679;</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
