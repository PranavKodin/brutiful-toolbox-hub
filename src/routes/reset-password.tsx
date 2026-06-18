import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Bytebox" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  return (
    <section className="bg-brand-pink border-b-[3px] border-foreground min-h-[80vh]">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="border-brutal bg-background shadow-brutal-lg p-8">
          <h1 className="font-display text-3xl mb-4">CHECK YOUR EMAIL</h1>
          <p className="font-medium mb-6">
            Password resets are handled through the link in the reset email. Click the link in your inbox to set a new password.
          </p>
          <Link
            to="/auth"
            className="inline-block border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
