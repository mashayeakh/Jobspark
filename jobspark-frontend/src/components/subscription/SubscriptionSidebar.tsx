/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Crown, Check, AlertCircle, ArrowRight, LogOut } from 'lucide-react';
import { SubscriptionDetails } from '@/services/paymentService';
import { authService } from '@/services/authService';
import Link from 'next/link';
import { useState } from 'react';

interface SubscriptionSidebarProps {
    subscription: SubscriptionDetails | null;
    onUpgradeClick?: () => void;
}

export const SubscriptionSidebar = ({ subscription, onUpgradeClick }: SubscriptionSidebarProps) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();

    if (!isAuthenticated || !subscription) {
        return (
            <div className="w-full lg:w-80 lg:fixed lg:right-0 lg:top-0 lg:h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 rounded-lg lg:rounded-none overflow-y-auto">
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Crown className="w-12 h-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-300 font-semibold mb-4">Sign in to view your subscription</p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const isSubscribed = subscription.isSubscribed;
    const periodEndDate = subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : 'N/A';

    const startDate = subscription.subscriptionStartedAt
        ? new Date(subscription.subscriptionStartedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : 'N/A';

    return (
        <div className="w-full lg:w-80 bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800 text-white p-6 rounded-lg lg:rounded-none sticky top-0 lg:static">
            {/* User Info */}
            <div className="mb-6 pb-6 border-b border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Logged in as</p>
                <p className="text-sm font-semibold text-white truncate mt-1">{user?.email}</p>
            </div>

            {/* Plan Badge */}
            <div className={`p-4 rounded-lg mb-6 ${isSubscribed
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}>
                <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5" />
                    <span className="font-bold">
                        {isSubscribed ? 'Professional Plan' : 'Free Plan'}
                    </span>
                </div>
                <p className="text-sm opacity-90">
                    {isSubscribed ? 'Active subscription' : 'Limited plan'}
                </p>
            </div>

            {/* Plan Details */}
            <div className="space-y-4 mb-6">
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                    <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold mb-1">Monthly Price</p>
                    <p className="text-2xl font-bold">
                        {isSubscribed ? '$299' : 'Free'}
                        <span className="text-xs text-gray-300 ml-1">/mo</span>
                    </p>
                </div>

                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                    <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold mb-1">Job Postings</p>
                    <p className="text-2xl font-bold">
                        {subscription.jobLimit === 'UNLIMITED' ? '∞' : subscription.jobLimit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{subscription.jobsUsed} used</p>
                </div>

                {isSubscribed && (
                    <>
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                            <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold mb-1">Started</p>
                            <p className="text-sm font-semibold">{startDate}</p>
                        </div>

                        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                            <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold mb-1">Renews</p>
                            <p className="text-sm font-semibold">{periodEndDate}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Features List */}
            {isSubscribed ? (
                <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4 mb-6">
                    <p className="font-semibold mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        Your benefits
                    </p>
                    <ul className="space-y-2 text-xs text-gray-200">
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 font-bold mt-0.5">✓</span>
                            <span>Unlimited job postings</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 font-bold mt-0.5">✓</span>
                            <span>Advanced search & filters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 font-bold mt-0.5">✓</span>
                            <span>Priority email support</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 font-bold mt-0.5">✓</span>
                            <span>Full ATS access</span>
                        </li>
                    </ul>
                </div>
            ) : (
                <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
                    <p className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-400" />
                        Limited plan
                    </p>
                    <p className="text-xs text-gray-200 mb-4">
                        You can post {subscription.jobLimit} jobs for free. Upgrade to unlimited posting and advanced features.
                    </p>
                    <button
                        onClick={onUpgradeClick}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                    >
                        Upgrade Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Dashboard Link */}
            <Link
                href="/recruiter/dashboard"
                className="block w-full text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold mb-3 transition"
            >
                View Dashboard
            </Link>

            {/* Logout */}
            <button
                onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                        await authService.logout();
                        window.location.href = '/';
                    } catch (error) {
                        console.error('Logout failed:', error);
                        setIsLoggingOut(false);
                    }
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition text-sm disabled:opacity-50"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
            {isLoggingOut && (
                <div className="fixed inset-0 z-[9999] bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded-full border-4 border-gray-600 border-t-blue-500 animate-spin" />
                        <p className="text-lg font-semibold text-white">Logging out now..</p>
                    </div>
                </div>
            )}
        </div>
    );
};
