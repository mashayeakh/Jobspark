/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CreditCard, CheckCircle } from 'lucide-react';

interface Payment {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    subscription: {
        planId: string;
    };
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const fetchPayments = async () => {
            try {
                const response = await apiClient.get<any>('/payment/all');
                if (mounted && response.success && response.data) {
                    setPayments(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch payments', err);
                if (mounted) toast.error('Failed to load payments');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchPayments();
        return () => { mounted = false; };
    }, []);

    const handleApprove = async (paymentId: string) => {
        setApproving(paymentId);
        try {
            const response = await apiClient.post<any>('/payment/approve', { paymentId });
            if (response.success) {
                toast.success('Payment approved successfully');
                setPayments(prev => prev.map(p => 
                    p.id === paymentId ? { ...p, status: 'COMPLETED' } : p
                ));
            } else {
                toast.error(response.message || 'Failed to approve payment');
            }
        } catch (err) {
            toast.error('An error occurred while approving payment');
        } finally {
            setApproving(null);
        }
    };

    if (loading) {
        return <div className="p-8">Loading payments...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments & Subscriptions</h1>
                <p className="text-gray-600">Review and approve manual payment requests</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Payments</CardTitle>
                            <CardDescription>All manual subscription payments waiting for approval</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recruiter</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No payments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{payment.user?.name || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500">{payment.user?.email}</div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-700 capitalize">
                                            {payment.subscription?.planId?.toLowerCase() || 'Professional'}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${payment.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' 
                                                : payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {payment.status === 'PENDING' ? (
                                                <Button 
                                                    size="sm" 
                                                    className="bg-[#4880FF] hover:bg-[#3d72eb]"
                                                    onClick={() => handleApprove(payment.id)}
                                                    disabled={approving === payment.id}
                                                >
                                                    {approving === payment.id ? 'Approving...' : 'Approve'}
                                                </Button>
                                            ) : payment.status === 'COMPLETED' ? (
                                                <Button size="sm" variant="outline" disabled className="bg-gray-50 text-green-700 border-green-200">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                    Approved
                                                </Button>
                                            ) : null}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
