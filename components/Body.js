export default function Body({ text }) {
  return (
    <div className="prose">
      {String(text || '').split(/\n{2,}/).map((blk, i) => {
        const b = blk.trim();
        if (!b) return null;
        const img = b.match(/^!\[(.*?)\]\((\/api\/img\/[a-z0-9]+)\)$/);
        if (img) return <figure key={i}><img src={img[2]} alt={img[1]} /></figure>;
        if (b.startsWith('## ')) return <h2 key={i}>{b.slice(3)}</h2>;
        if (b.startsWith('> ')) return <blockquote key={i}>{b.slice(2)}</blockquote>;
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}
