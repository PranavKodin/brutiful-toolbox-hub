import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getPost, posts, type Post } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Post"} — Unit Tools Blog` },
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
  const post = Route.useLoaderData() as Post;
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

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

      {related.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl mb-4">Keep reading</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="border-brutal bg-card p-5 shadow-brutal-sm hover-lift block"
              >
                <span className="font-mono text-xs uppercase">{p.tag}</span>
                <div className="font-display text-lg mt-1">{p.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
