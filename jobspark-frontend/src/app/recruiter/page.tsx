import Link from "next/link";

export default function RecruiterPage() {
    return (
        <main className="min-h-screen bg-muted/10 px-6 py-12">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                <section className="rounded-3xl border border-border bg-card p-10 shadow-lg shadow-muted/20">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                Recruiter space
                            </p>
                            <h1 className="mt-2 text-4xl font-semibold">Build your dream team</h1>
                        </div>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Post jobs, review applicants, and manage hiring pipelines from one dashboard.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                            >
                                Sign in to post jobs
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-2xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                            >
                                Create recruiter profile
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <article className="rounded-3xl border border-border bg-background p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold">Candidate sourcing</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Discover qualified talent and track candidate progress in one place.
                        </p>
                    </article>
                    <article className="rounded-3xl border border-border bg-background p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold">Team collaboration</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Share job posts, review notes, and align hiring decisions with your team.
                        </p>
                    </article>
                </section>
            </div>
        </main>
    );
}
