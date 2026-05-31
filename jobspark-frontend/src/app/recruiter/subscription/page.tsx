'use client';

import React from 'react';
import { SubscriptionStatus } from '@/components/dashboards/SubscriptionStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export default function SubscriptionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await apiClient.get<any>('/payment/subscription-details');
                if (response.success && response.data) {
                    setStatus(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch subscription status', err);
            }
        };

        const verifySession = async () => {
            const checkout = searchParams.get('checkout');
            const sessionId = searchParams.get('session_id');

            if (checkout === 'success' && sessionId) {
                try {
                    const res = await apiClient.post<any>('/payment/verify-checkout-session', { sessionId });
                    if (res.success) {
                        toast.success('Payment confirmed! Waiting for admin approval.');
                        router.replace('/recruiter/subscription');
                    }
                } catch (e) {
                    console.error('Failed to verify session', e);
                }
            } else if (checkout === 'cancel') {
                toast.error('Checkout was cancelled.');
                router.replace('/recruiter/subscription');
            }
        };

        verifySession().then(() => fetchStatus());
    }, [searchParams, router]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
                <p className="text-gray-600">Manage your subscription plan and billing details</p>
            </div>

            <SubscriptionStatus />

            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Subscription History</h2>
                    <p className="text-sm text-gray-500 mt-1">A record of your previous and current subscriptions</p>
                </div>
                
                {status?.subscriptions && status.subscriptions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {status.subscriptions.map((sub: any) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-medium text-gray-900">
                                            {sub.type === 'MONTHLY' ? 'Professional (Monthly)' : sub.type}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                sub.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : sub.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }>
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {new Date(sub.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {new Date(sub.endDate).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No subscription history found.
                    </div>
                )}
            </div>
        </div>
    );
}
