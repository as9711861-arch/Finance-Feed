'use client';
import { useEffect, useState } from 'react';
import TV from './TV';

const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LiveTicker({ fallback }) {
  const [q, setQ] = useState(null);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        const j = await (await fetch('/api/quotes')).json();
        if (!off && Array.isArray(j) && j.length) setQ(j);
        else if (!off) setQ((p) => p ?? []);
      } catch {
        if (!off) setQ((p) => p ?? []);
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => { off = true; clearInterval(t); };
  }, []);

  if (q && q.length === 0) return <TV type="ticker-tape" config={fallback} height={46} />;
  if (!q) return <div className="qt" />;

  return (
    <div className="qt" aria-label="Market quotes">
      <div className="qt-track">
        {[0, 1].map((k) => (
          <div key={k} className="qt-set" aria-hidden={k === 1}>
            {q.map((x) => (
              <span key={x.name} className="qi">
                <b>{x.name}</b>
                <span>{fmt(x.price)}</span>
                <em className={x.change >= 0 ? 'up' : 'dn'}>
                  {x.change >= 0 ? '\u25B2' : '\u25BC'} {fmt(Math.abs(x.change))} ({fmt(Math.abs(x.pct))}%)
                </em>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
