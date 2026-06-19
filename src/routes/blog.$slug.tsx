import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getPost, posts as seedPosts, type Post } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    // Allow Firestore-only posts: don't 404 here; component will fetch.
    return post ?? ({ slug: params.slug } as Partial<Post>);
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Post"} — Tools Lab Blog` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${loaderData?.slug}` },
    ],
    links: [{ rel: "canonical", href: `/blog/${loaderData?.slug}` }],
  }),
  component: BlogPost,
});

function BlogPost() {
  const initial = Route.useLoaderData() as Post;
  const [post, setPost] = useState<Post | null>(initial?.title ? initial : null);
  const [loading, setLoading] = useState(!initial?.title);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "posts", initial.slug));
        if (cancelled) return;
        if (snap.exists()) setPost(snap.data() as Post);
        else if (!post) setPost(seedPosts.find((p) => p.slug === initial.slug) ?? null);
      } catch {
        if (!post) setPost(seedPosts.find((p) => p.slug === initial.slug) ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [initial.slug]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-20 font-mono">Loading…</div>;
  if (!post) throw notFound();

  return (
    <>
      <section className={`bg-brand-${post.color} border-b-[3px] border-foreground`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/blog" className="inline-flex items-center gap-2 font-bold uppercase text-sm hover:underline mb-6">
            <ArrowLeft className="size-4" /> Back to blog
          </Link>
          <span className="font-mono text-xs uppercase border-brutal bg-background px-2 py-1">{post.tag}</span>
          <h1 className="mt-4 text-4xl md:text-6xl">{post.title}</h1>
          <div className="mt-4 font-mono text-xs uppercase">
            {new Date(post.date).toLocaleDateString()} · {post.readTime} · By {post.author}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-brutal bg-card shadow-brutal p-6 md:p-10 space-y-5">
          <p className="font-display text-xl md:text-2xl leading-tight">{post.excerpt}</p>
          {post.body.map((p, i) => (
            <p key={i} className="font-medium text-lg leading-relaxed">{p}</p>
          ))}
        </div>
      </article>
    </>
  );
}
