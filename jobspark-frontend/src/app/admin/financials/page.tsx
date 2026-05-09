'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const transactions = [
  { id: 'TRX-9401', client: 'Google', amount: '+$1,200.00', status: 'Completed', date: 'Oct 24, 2024' },
  { id: 'TRX-9402', client: 'Meta', amount: '+$2,450.00', status: 'Completed', date: 'Oct 23, 2024' },
  { id: 'TRX-9403', client: 'Netflix', amount: '-$150.00', status: 'Refunded', date: 'Oct 22, 2024' },
  { id: 'TRX-9404', client: 'Amazon', amount: '+$800.00', status: 'Pending', date: 'Oct 21, 2024' },
];

export default function FinancialsPage() {
  return (
    <AdminShell title="Financials">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Financials</h2>
            <p className="text-gray-500 font-medium">Revenue tracking and transaction management</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl border-gray-200 font-bold shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
              Manage Subscriptions
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-blue-200 font-bold text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  +12.5%
                </div>
              </div>
              <p className="text-blue-100 font-medium mb-1">Total Revenue</p>
              <h3 className="text-4xl font-bold mb-6">$124,500.00</h3>
              <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Updated 1 hour ago
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-green-50 rounded-2xl">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  +8.2%
                </div>
              </div>
              <p className="text-gray-500 font-bold mb-1">Active Subscriptions</p>
              <h3 className="text-4xl font-bold text-[#202224] mb-6">1,245</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Premium Enterprise Plan</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-red-50 rounded-2xl">
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600 font-bold text-sm">
                  <ArrowDownRight className="h-4 w-4" />
                  -2.4%
                </div>
              </div>
              <p className="text-gray-500 font-bold mb-1">Refund Requests</p>
              <h3 className="text-4xl font-bold text-[#202224] mb-6">14</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Value: $2,400</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 bg-white border-b border-gray-100">
            <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="font-bold text-blue-600">All</Button>
              <Button variant="ghost" size="sm" className="font-bold text-gray-400">Incoming</Button>
              <Button variant="ghost" size="sm" className="font-bold text-gray-400">Outgoing</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-blue-600">{trx.id}</td>
                      <td className="px-8 py-6 font-bold text-[#202224]">{trx.client}</td>
                      <td className={`px-8 py-6 font-bold ${trx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {trx.amount}
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={`${
                          trx.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                          trx.status === 'Refunded' ? 'bg-red-50 text-red-600' : 
                          'bg-yellow-50 text-yellow-600'
                        } border-0 rounded-lg px-3 py-1 font-bold`}>
                          {trx.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-gray-400 font-bold">{trx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
