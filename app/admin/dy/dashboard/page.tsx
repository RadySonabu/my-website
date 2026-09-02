import { redirect } from "next/navigation";
import { requireAdminSession } from "@/app/lib/session";
import { logout } from "../actions";

export default async function AdminDashboardPage() {
  const authed = await requireAdminSession();
  if (!authed) {
    redirect("/admin/dy");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Logged in</h1>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5"
          style={{
            borderColor: "var(--hero-cream)",
            color: "var(--hero-cream)",
          }}
        >
          Log out
        </button>
      </form>
    </main>
  );
}
