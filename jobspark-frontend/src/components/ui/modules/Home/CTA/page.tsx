// components/CTASection.tsx
import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-12 sm:py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Where startups and job seekers connect
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    <Link
                        href="/hire"
                        className="px-6 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-700 transition"
                    >
                        Find your next hire
                    </Link>
                    <Link
                        href="/jobs"
                        className="px-6 py-3 rounded-md bg-white border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition"
                    >
                        Find your next job
                    </Link>
                </div>
            </div>
        </section>
    );
}
