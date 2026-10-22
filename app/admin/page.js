'use client';
import { useEffect, useRef, useState } from 'react';

const blank = { title: '', dek: '', category: 'Research', cover: '', body: '', published: true };

async function compress(file) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });
  const sc = Math.min(1, 1400 / img.width);
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * sc);
  c.height = Math.round(img.height * sc);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  let q = 0.82, d = c.toDataURL('image/jpeg', q);
  while (d.length > 850000 && q > 0.3) { q -= 0.1; d = c.toDataURL('image/jpeg', q); }
  return d;
}

async function uploadImage(file) {
  const data = await compress(file);
  const r = await fetch('/api/img', { method: 'POST', body: JSON.stringify({ data }) });
  if (!r.ok) throw new Error((await r.json()).error || 'Upload fail');
  return (await r.json()).url;
}

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const bodyRef = useRef(null);

  const load = async () => {
    const r = await fetch('/api/articles');
    if (r.status === 401) return setAuthed(false);
    setList(await r.json());
    setAuthed(true);
  };
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const login = async (e) => {
    e.preventDefault();
    setErr('');
    const r = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
    if (!r.ok) return setErr('Galat password');
    setPw('');
    load();
  };

  const logout = async () => { await fetch('/api/logout', { method: 'POST' }); setAuthed(false); };

  const save = async () => {
    setBusy(true); setMsg('');
    const r = await fetch(editId ? `/api/articles/${editId}` : '/api/articles', {
      method: editId ? 'PUT' : 'POST', body: JSON.stringify(form),
    });
    setBusy(false);
    if (!r.ok) return setMsg((await r.json()).error || 'Save fail');
    setMsg(editId ? 'Updated' : 'Published');
    setForm(blank); setEditId(null); load();
  };

  const edit = (a) => { setEditId(a.id); setForm({ title: a.title, dek: a.dek, category: a.category, cover: a.cover, body: a.body, published: a.published }); window.scrollTo(0, 0); };

  const del = async (a) => {
    if (!confirm(`"${a.title}" delete karna hai?`)) return;
    await fetch(`/api/articles/${a.id}`, { method: 'DELETE' });
    if (editId === a.id) { setForm(blank); setEditId(null); }
    load();
  };

  const pickCover = async (f) => { if (!f) return; try { setBusy(true); set('cover', await uploadImage(f)); } catch (e) { setMsg(e.message); } setBusy(false); };

  const pickInline = async (f) => {
    if (!f) return;
    try {
      setBusy(true);
      const url = await uploadImage(f);
      const el = bodyRef.current, pos = el ? el.selectionStart : form.body.length;
      const b = form.body;
      set('body', `${b.slice(0, pos)}\n\n![](${url})\n\n${b.slice(pos)}`);
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  };

  if (authed === null) return <p className="empty">Loading…</p>;

  if (!authed) return (
    <form className="login" onSubmit={login}>
      <h1>Editor access</h1>
      <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" autoFocus />
      {err && <div className="err">{err}</div>}
      <button className="btn">Enter</button>
    </form>
  );

  return (
    <div className="admin">
      <div className="admin-top">
        <h1>{editId ? 'Article edit karo' : 'Naya article'}</h1>
        <button className="btn ghost" onClick={logout}>Logout</button>
      </div>

      <label>Title<input value={form.title} onChange={(e) => set('title', e.target.value)} /></label>
      <label>Short summary<textarea rows={2} value={form.dek} onChange={(e) => set('dek', e.target.value)} /></label>
      <label>Category<input value={form.category} onChange={(e) => set('category', e.target.value)} /></label>

      <div className="field">
        <span>Cover image</span>
        {form.cover && <img className="thumb" src={form.cover} alt="" />}
        <input type="file" accept="image/*" onChange={(e) => pickCover(e.target.files[0])} />
        {form.cover && <button className="btn ghost sm" onClick={() => set('cover', '')}>Remove cover</button>}
      </div>

      <div className="field">
        <span>Body (paragraph ke beech blank line; <code>## </code> heading; <code>&gt; </code> quote)</span>
        <textarea ref={bodyRef} rows={18} value={form.body} onChange={(e) => set('body', e.target.value)} />
        <label className="filebtn">Cursor par image daalo
          <input type="file" accept="image/*" onChange={(e) => { pickInline(e.target.files[0]); e.target.value = ''; }} hidden />
        </label>
      </div>

      <label className="check"><input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} /> Published (uncheck = draft, sirf tum dekh sakte ho)</label>

      <div className="actions">
        <button className="btn" disabled={busy} onClick={save}>{busy ? 'Wait…' : editId ? 'Update' : 'Publish'}</button>
        {editId && <button className="btn ghost" onClick={() => { setForm(blank); setEditId(null); }}>Cancel</button>}
        {msg && <span className="msg">{msg}</span>}
      </div>

      <h2 className="all-h">Saare articles</h2>
      {list.length === 0 && <p className="empty">Koi article nahi.</p>}
      {list.map((a) => (
        <div key={a.id} className="arow">
          <div>
            <strong>{a.title}</strong>
            <div className="meta">{a.category} · {a.published ? 'Live' : 'Draft'} · {new Date(a.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
          <div className="btns">
            <a className="btn ghost sm" href={`/article/${a.id}`} target="_blank">View</a>
            <button className="btn ghost sm" onClick={() => edit(a)}>Edit</button>
            <button className="btn danger sm" onClick={() => del(a)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
