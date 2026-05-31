import apiClient from '@/lib/api';

export interface SubscriptionDetails {
    isSubscribed: boolean;
    subscriptionStatus: string;
    subscriptionStartedAt: string | null;
    currentPeriodEnd: string | null;
    stripeCustomerId: string | null;
    jobsUsed: number;
    jobLimit: number | string;
    subscriptions: any[];
}

export const paymentService = {
    async getSubscriptionDetails(): Promise<SubscriptionDetails | null> {
        try {
            const response = await apiClient.get<SubscriptionDetails>('/payment/subscription-details');
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch subscription details:', error);
            return null;
        }
    },

    isSubscriptionActive(status: string): boolean {
        return ['ACTIVE', 'TRIALING'].includes(status);
    },

    formatDate(dateString: string | null): string {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }
};
