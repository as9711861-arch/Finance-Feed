import Link from 'next/link';
import { notFound } from 'next/navigation';
import Body from '@/components/Body';
import Share from '@/components/Share';
import { getArticle } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { readTime } from '@/lib/util';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const a = await getArticle(id).catch(() => null);
  if (!a || !a.published) return { title: 'Finance Feed' };
  return {
    title: a.title,
    description: a.dek || undefined,
    openGraph: {
      title: a.title, description: a.dek || undefined, type: 'article', siteName: 'Finance Feed',
      publishedTime: new Date(a.createdAt).toISOString(), images: a.cover ? [{ url: a.cover }] : [],
    },
    twitter: { card: a.cover ? 'summary_large_image' : 'summary', title: a.title, description: a.dek || undefined },
  };
}

export default async function Article({ params }) {
  const { id } = await params;
  const a = await getArticle(id).catch(() => null);
  if (!a || (!a.published && !(await isAdmin()))) notFound();
  const path = `/article/${a.id}`;
  return (
    <article className="single">
      <Link href="/" className="back">Back to Finance Feed</Link>
      <div className="cat">{a.category}{!a.published && ' (Draft)'}</div>
      <h1>{a.title}</h1>
      {a.dek && <p className="dek">{a.dek}</p>}
      <div className="byline">
        <span>By {a.author || 'Finance Feed Research'}</span>
        <span>{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span>{readTime(a.body)} min read</span>
      </div>
      <Share title={a.title} path={path} variant="top" />
      {a.cover && (
        <figure className="cover">
          <img src={a.cover} alt="" />
          {a.coverCaption && <figcaption>{a.coverCaption}</figcaption>}
        </figure>
      )}
      <Body text={a.body} />
      <div className="endshare">
        <div className="endshare-h">Found this useful? Share it.</div>
        <Share title={a.title} path={path} />
      </div>
      <Share title={a.title} path={path} variant="fixed" />
    </article>
  );
}
