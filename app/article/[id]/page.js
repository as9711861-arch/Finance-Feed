import Link from 'next/link';
import { notFound } from 'next/navigation';
import Body from '@/components/Body';
import { getArticle } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const a = await getArticle(id).catch(() => null);
  return { title: a ? `${a.title} | Finance Feed` : 'Finance Feed' };
}

export default async function Article({ params }) {
  const { id } = await params;
  const a = await getArticle(id).catch(() => null);
  if (!a || (!a.published && !(await isAdmin()))) notFound();
  return (
    <article className="single">
      <Link href="/" className="back">&larr; Back to Finance Feed</Link>
      <div className="cat">{a.category}{!a.published && ' (Draft)'}</div>
      <h1>{a.title}</h1>
      {a.dek && <p className="dek">{a.dek}</p>}
      <div className="meta">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      {a.cover && <img className="cover" src={a.cover} alt="" />}
      <Body text={a.body} />
    </article>
  );
}
