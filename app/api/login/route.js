import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { token, adminPassword } from '@/lib/auth';
import { redis, redisInfo } from '@/lib/db';

export const dynamic = 'force-dynamic';

const h = (s) => crypto.createHash('sha256').update(String(s)).digest();

// Open /api/login in the browser to check password + database connection.
export async function GET() {
  let redisStatus = 'ok';
  try { await redis.ping(); }
  catch (e) { redisStatus = 'error: ' + String(e?.message || e).replace(/https?:\/\/\S+/g, '[url]').slice(0, 160); }
  return NextResponse.json({
    passwordConfigured: !!adminPassword(),
    redisUrlFound: redisInfo.urlFound,
    redisTokenFound: redisInfo.tokenFound,
    redisStatus,
  });
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
