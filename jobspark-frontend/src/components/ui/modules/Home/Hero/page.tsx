'use client';

import { ArrowRight, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ButtonConfig {
    text: string;
    url: string;
    variant?: "primary" | "secondary";
}

interface ImageConfig {
    src: string;
    alt: string;
    srcDark?: string;
}

interface HeroProps {
    icon?: React.ReactNode;
    heading: string;
    description: string;
    primaryButton?: ButtonConfig;
    secondaryButton?: ButtonConfig;
    byline?: string;
    image?: ImageConfig;
    className?: string;
}

type Props = Partial<HeroProps>;

const defaultProps: HeroProps = {
    icon: <Wifi className="size-6" />,
    heading: "Find Your Dream Job or Hire Top Talent",
    description: "Connect with 50,000+ companies and 1M+ job seekers. Remote, hybrid, and on-site opportunities worldwide.",
    primaryButton: {
        text: "Find Jobs",
        url: "/jobs",
        variant: "primary",
    },
    secondaryButton: {
        text: "Post a Job",
        url: "/hire",
        variant: "secondary",
    },
    byline: "Join 500,000+ professionals who found their match",
    image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9.png",
        srcDark: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9-dark.png",
        alt: "Job Platform Hero",
    },
};

const HeroSection = (props: Props) => {
    const router = useRouter();
    const { icon, heading, description, primaryButton, secondaryButton, byline, image, className } = {
        ...defaultProps,
        ...props,
    };

    const handlePostJobClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const user = authService.getUser();
        const isAuthenticated = authService.isAuthenticated();

        if (!isAuthenticated) {
            router.push('/login?returnTo=/recruiter/post-job');
            return;
        }

        if (user?.role !== 'RECRUITER') {
            alert('Only recruiters can post jobs.');
            return;
        }

        router.push('/recruiter/post-job');
    };

    return (
        <section className={cn("min-h-[70vh] lg:min-h-[70vh] overflow-hidden relative bg-gradient-to-br from-blue-50 via-white to-purple-50", className)}>
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
                        {/* Icon */}
                        {icon && (
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 lg:mb-6">
                                <div className="text-blue-600 animate-pulse">
                                    {icon}
                                </div>
                            </div>
                        )}

                        {/* Heading */}
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up">
                            {heading}
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg lg:text-2xl text-gray-600 max-w-2xl animate-fade-in-up animation-delay-200">
                            {description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
                            {primaryButton && (
                                <Link
                                    href={primaryButton.url}
                                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    {primaryButton.text}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                            {secondaryButton && (
                                <button
                                    onClick={handlePostJobClick}
                                    className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                                >
                                    {secondaryButton.text}
                                </button>
                            )}
                        </div>

                        {/* Byline */}
                        {byline && (
                            <div className="text-sm sm:text-base text-gray-500 animate-fade-in-up animation-delay-600">
                                {byline}
                            </div>
                        )}
                    </div>

                    {/* Image Section */}
                    {image && (
                        <div className="flex-1 animate-fade-in-up animation-delay-800">
                            {image.srcDark ? (
                                <>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-auto rounded-2xl shadow-2xl dark:hidden"
                                    />
                                    <img
                                        src={image.srcDark}
                                        alt={image.alt}
                                        className="w-full h-auto rounded-2xl shadow-2xl hidden dark:block"
                                    />
                                </>
                            ) : (
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-auto rounded-2xl shadow-2xl"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator — hidden on small screens to avoid overlap */}
            <div className="hidden sm:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-300 rounded-full mt-2"></div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                
                .animation-delay-800 {
                    animation-delay: 0.8s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
};

export { HeroSection };
