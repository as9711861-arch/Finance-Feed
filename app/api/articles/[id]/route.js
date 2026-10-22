import { NextResponse } from 'next/server';
import { redis, getArticle } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { clean } from '@/lib/clean';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const old = await getArticle(id);
  if (!old) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = clean(await req.json());
  if (!data.title) return NextResponse.json({ error: 'Title chahiye' }, { status: 400 });
  await redis.set(`article:${id}`, { ...old, ...data, updatedAt: Date.now() });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await redis.del(`article:${id}`);
  await redis.zrem('articles', id);
  return NextResponse.json({ ok: true });
}
