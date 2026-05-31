/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Crown, Check, AlertCircle, ArrowRight, Calendar } from 'lucide-react';
import { SubscriptionDetails } from '@/services/paymentService';

interface SubscriptionCardProps {
    subscription: SubscriptionDetails | null;
    onUpgradeClick?: () => void;
}

export const SubscriptionCard = ({ subscription, onUpgradeClick }: SubscriptionCardProps) => {
    if (!subscription) {
        return null;
    }

    const isSubscribed = subscription.isSubscribed;
    const periodEndDate = subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    const startDate = subscription.subscriptionStartedAt
        ? new Date(subscription.subscriptionStartedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <div className={`rounded-xl border-2 p-6 transition-all duration-300 ${isSubscribed
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
            }`}>
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${isSubscribed ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                        <Crown className={`w-6 h-6 ${isSubscribed ? 'text-green-600' : 'text-blue-600'
                            }`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Professional Plan</h3>
                        <p className={`text-sm ${isSubscribed ? 'text-green-600 font-semibold' : 'text-blue-600 font-semibold'
                            }`}>
                            {subscription.subscriptionStatus}
                        </p>
                    </div>
                </div>
                {isSubscribed && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Check className="w-3 h-3" />
                        Active
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-semibold mb-1">PLAN</p>
                    <p className="text-lg font-bold text-gray-900">$299</p>
                    <p className="text-xs text-gray-500">/month</p>
                </div>

                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-semibold mb-1">JOB POSTINGS</p>
                    <p className="text-lg font-bold text-green-600">
                        {subscription.jobLimit === 'UNLIMITED' ? '∞' : subscription.jobLimit}
                    </p>
                    <p className="text-xs text-gray-500">
                        {subscription.jobsUsed} used
                    </p>
                </div>

                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-semibold mb-1">STARTED</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{startDate}</p>
                </div>

                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-semibold mb-1">RENEWS</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{periodEndDate}</p>
                </div>
            </div>

            {isSubscribed && (
                <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-6 border border-green-200">
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900 mb-2">Your subscription includes:</p>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>✓ Unlimited job postings</li>
                                <li>✓ Advanced search & filters</li>
                                <li>✓ Priority support</li>
                                <li>✓ Full ATS access</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {!isSubscribed && (
                <div className="bg-blue-100 bg-opacity-50 rounded-lg p-4 mb-6 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900 mb-1">Limited plan active</p>
                            <p className="text-sm text-gray-700 mb-3">
                                You can post {subscription.jobLimit} jobs for free. Upgrade to unlimited posting.
                            </p>
                            <button
                                onClick={onUpgradeClick}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Upgrade to Professional
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                {isSubscribed && (
                    <>
                        <button className="flex-1 px-4 py-2 bg-white border-2 border-green-300 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                            Manage Subscription
                        </button>
                        <button className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Download Invoice
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
