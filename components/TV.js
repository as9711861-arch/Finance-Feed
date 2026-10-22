'use client';
import { useEffect, useRef } from 'react';

export default function TV({ type, config, height }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.innerHTML = '';
    const w = document.createElement('div');
    w.className = 'tradingview-widget-container__widget';
    el.appendChild(w);
    const s = document.createElement('script');
    s.src = `https://s3.tradingview.com/external-embedding/embed-widget-${type}.js`;
    s.async = true;
    s.innerHTML = JSON.stringify(config);
    el.appendChild(s);
  }, [type]);
  return <div className="tradingview-widget-container" ref={ref} style={{ minHeight: height }} />;
}
