import Link from "next/link";

export default function JobSeekerPage() {
    return (
        <main className="min-h-screen bg-muted/10 px-6 py-12">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                <section className="rounded-3xl border border-border bg-card p-10 shadow-lg shadow-muted/20">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                Job seeker space
                            </p>
                            <h1 className="mt-2 text-4xl font-semibold">Find your next career move</h1>
                        </div>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Browse openings, save opportunities, and apply quickly with your profile.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                            >
                                Sign in to apply
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-2xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                            >
                                Create profile
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <article className="rounded-3xl border border-border bg-background p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold">Job alerts</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Get notified for the roles that match your skills and location.
                        </p>
                    </article>
                    <article className="rounded-3xl border border-border bg-background p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold">Saved searches</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Keep your favorite job searches and resume ready to share.
                        </p>
                    </article>
                </section>
            </div>
        </main>
    );
}
