import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis, listArticles } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { clean } from '@/lib/clean';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await listArticles(true));
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = clean(await req.json());
  if (!data.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const id = 'a' + crypto.randomBytes(4).toString('hex');
  const now = Date.now();
  await redis.set(`article:${id}`, { id, ...data, createdAt: now, updatedAt: now });
  await redis.zadd('articles', { score: now, member: id });
  return NextResponse.json({ id });
}
