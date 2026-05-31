/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Shield, CreditCard, CheckCircle } from 'lucide-react';

interface SubscriptionStatusData {
  isSubscribed: boolean;
  subscriptionStatus: string;
  jobsUsed: number;
  jobLimit: number | 'UNLIMITED';
  currentPeriodEnd: string | null;
}

export function SubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get<any>('/payment/subscription-details');
        if (response.success && response.data) {
          setStatus(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch subscription status', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const response = await apiClient.post<any>('/subscription/create-customer-portal', {});
      if (response.success && response.data?.portalUrl) {
        window.location.href = response.data.portalUrl;
      }
    } catch (err) {
      console.error('Failed to create customer portal', err);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const response = await apiClient.post<any>('/payment/create-checkout-session', {});
      if (response.success && response.data?.checkoutUrl) {
        window.location.assign(response.data.checkoutUrl);
      } else {
        console.error('Failed to create checkout session', response);
      }
    } catch (err) {
      console.error('Failed to create checkout session', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading || !status) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Subscription Plan
          </CardTitle>
          <Badge className={
            status.subscriptionStatus === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : status.subscriptionStatus === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }>
            {status.subscriptionStatus}
          </Badge>
        </div>
        <CardDescription>
          {status.subscriptionStatus === 'ACTIVE'
            ? 'You are on the Premium plan with unlimited job postings.' 
            : status.subscriptionStatus === 'PENDING'
              ? 'Your subscription request is pending admin approval.'
              : 'You are on the Free plan. Upgrade to post more jobs.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Jobs Posted</p>
            <p className="text-2xl font-bold text-gray-900">{status.jobsUsed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job Limit</p>
            <p className="text-2xl font-bold text-gray-900">
              {status.jobLimit === 'UNLIMITED' ? 'Unlimited' : status.jobLimit}
            </p>
          </div>
          {status.currentPeriodEnd && (
            <div>
              <p className="text-sm text-gray-500">Renews On</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(status.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {status.subscriptionStatus === 'ACTIVE' ? (
            <Button 
              variant="outline" 
              className="bg-white" 
              onClick={handleManageBilling}
              disabled={portalLoading}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {portalLoading ? 'Loading...' : 'Manage Billing'}
            </Button>
          ) : status.subscriptionStatus === 'PENDING' ? (
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white" 
              disabled
            >
              Waiting for Admin Approval
            </Button>
          ) : (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleUpgrade}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Loading...' : 'Subscribe to Premium'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
