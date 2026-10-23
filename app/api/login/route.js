import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { token, adminPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const h = (s) => crypto.createHash('sha256').update(String(s)).digest();

// Open /api/login in the browser to check whether the server can see ADMIN_PASSWORD.
export async function GET() {
  return NextResponse.json({ passwordConfigured: !!adminPassword() });
}

export async function POST(req) {
  const { password = '' } = await req.json().catch(() => ({}));
  const pw = adminPassword();
  if (!pw || !crypto.timingSafeEqual(h(String(password).trim()), h(pw))) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ff_admin', token(), {
    httpOnly: true, sameSite: 'strict', path: '/',
    secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
