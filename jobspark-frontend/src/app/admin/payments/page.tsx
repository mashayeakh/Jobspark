/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminShell } from '@/components/layouts/AdminShell';
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
        return (
            <AdminShell title="Payments">
                <div className="p-8">Loading payments...</div>
            </AdminShell>
        );
    }

    return (
        <AdminShell title="Payments">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Premium Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
                            <CreditCard className="w-8 h-8 opacity-90" />
                            Payments & Subscriptions
                        </h1>
                        <p className="text-blue-100 max-w-2xl text-lg font-medium">Review and manage manual subscription payment requests from recruiters.</p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 right-40 -mb-20 w-48 h-48 rounded-full bg-indigo-300 opacity-20 blur-2xl"></div>
                </div>

                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6 sm:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">Recent Transactions</CardTitle>
                                <CardDescription className="text-gray-500 mt-1">All manual subscription payments waiting for your approval.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow className="hover:bg-transparent border-b border-gray-100">
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider py-5 px-6">Recruiter</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider py-5">Plan</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider py-5">Amount</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider py-5">Date</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider py-5">Status</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider py-5 text-right px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16 text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <CreditCard className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-lg font-medium text-gray-900">No payments found</p>
                                                <p className="text-gray-500">There are currently no manual payments to review.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-inner ring-1 ring-indigo-200/50">
                                                        {payment.user?.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{payment.user?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500 font-medium">{payment.user?.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-indigo-900 capitalize bg-indigo-50/30 px-4 rounded-lg my-2 inline-block">
                                                {payment.subscription?.planId?.toLowerCase() || 'Professional'}
                                            </TableCell>
                                            <TableCell className="font-bold text-gray-900 text-base">
                                                ${payment.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-gray-500 font-medium text-sm">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    payment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                                    : payment.status === 'PENDING' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                {payment.status === 'PENDING' ? (
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg font-semibold"
                                                        onClick={() => handleApprove(payment.id)}
                                                        disabled={approving === payment.id}
                                                    >
                                                        {approving === payment.id ? (
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                Approving...
                                                            </span>
                                                        ) : 'Approve'}
                                                    </Button>
                                                ) : payment.status === 'COMPLETED' ? (
                                                    <Button size="sm" variant="outline" disabled className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg font-semibold opacity-100">
                                                        <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                                                        Approved
                                                    </Button>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
        </AdminShell>
    );
}
