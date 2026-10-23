'use client';
import { useEffect, useState } from 'react';

export default function Share({ title, path, variant = '' }) {
  const [url, setUrl] = useState(path);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.origin + path);
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, [path]);

  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const links = [
    ['WhatsApp', `https://wa.me/?text=${t}%20${u}`, '#25D366'],
    ['X', `https://twitter.com/intent/tweet?text=${t}&url=${u}`, '#111111'],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, '#0A66C2'],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`, '#1877F2'],
    ['Telegram', `https://t.me/share/url?url=${u}&text=${t}`, '#229ED9'],
    ['Email', `mailto:?subject=${t}&body=${u}`, '#5b6573'],
  ];

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); }
    catch {
      const el = document.createElement('textarea');
      el.value = url; document.body.appendChild(el); el.select();
      document.execCommand('copy'); el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`share ${variant}`}>
      <span className="share-l">Share</span>
      {canShare && (
        <button type="button" className="sh sh-native" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
          Share
        </button>
      )}
      {links.map(([name, href, c]) => (
        <a key={name} className="sh" href={href} target="_blank" rel="noopener noreferrer">
          <i style={{ background: c }} />{name}
        </a>
      ))}
      <button type="button" className="sh" onClick={copy}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
        {copied ? 'Link copied' : 'Copy link'}
      </button>
    </div>
  );
}
