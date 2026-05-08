import Link from "next/link";

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-muted/10 px-6 py-12">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card px-8 py-10 shadow-lg shadow-muted/20">
                <h1 className="text-3xl font-semibold">Create your account</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    Join JobsPark as a job seeker or recruiter.
                </p>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Full name</label>
                        <input
                            type="text"
                            placeholder="Your full name"
                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                    >
                        Sign up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}
