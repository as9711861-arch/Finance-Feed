import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data } = await req.json().catch(() => ({}));
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(data || '') || data.length > 900000)
    return NextResponse.json({ error: 'Invalid or oversized image' }, { status: 400 });
  const id = 'i' + crypto.randomBytes(5).toString('hex');
  await redis.set(`img:${id}`, data);
  return NextResponse.json({ url: `/api/img/${id}` });
}
