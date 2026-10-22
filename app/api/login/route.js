import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { token } from '@/lib/auth';

const h = (s) => crypto.createHash('sha256').update(String(s)).digest();

export async function POST(req) {
  const { password = '' } = await req.json().catch(() => ({}));
  const pw = process.env.ADMIN_PASSWORD || '';
  if (!pw || !crypto.timingSafeEqual(h(password), h(pw))) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'Galat password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ff_admin', token(), {
    httpOnly: true, sameSite: 'strict', path: '/',
    secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
