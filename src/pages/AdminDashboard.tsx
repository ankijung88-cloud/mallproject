import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, Clock, Download, ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        revenue: 0,
        ordersMonthly: 0,
        ordersDaily: 0,
        users: 0,
        growth: '+12%'
    });
    const [dailyOrders, setDailyOrders] = useState<any[]>([]);
    const [newMembers, setNewMembers] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState('Today');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(() => {
        setIsRefreshing(true);
        const storedMembers = localStorage.getItem('mall_members');
        const storedOrders = localStorage.getItem('mall_orders');

        const members = storedMembers ? JSON.parse(storedMembers) : [];
        const orders = storedOrders ? JSON.parse(storedOrders) : [];

        // 1. Calculate Revenue (Total)
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (Number(order.totalAmount) || 0), 0);

        // 2. Count Orders (Monthly)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyCount = orders.filter((o: any) => {
            const d = new Date(o.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).length;

        // 3. Daily Orders
        const cycleStart = new Date(now);
        if (now.getHours() >= 12 && now.getMinutes() >= 1) {
            cycleStart.setHours(12, 1, 0, 0); // Today 12:01 PM
        } else {
            cycleStart.setDate(cycleStart.getDate() - 1); // Yesterday
            cycleStart.setHours(12, 1, 0, 0);
        }
        const cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleEnd.getDate() + 1);

        const dailyFiltered = orders.filter((o: any) => {
            const d = new Date(o.date);
            return d >= cycleStart && d < cycleEnd;
        });
        const dailySorted = dailyFiltered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Update State
        setStats({
            revenue: totalRevenue,
            ordersMonthly: monthlyCount,
            ordersDaily: dailyFiltered.length,
            users: members.length,
            growth: '+12.5%'
        });
        setDailyOrders(dailySorted);
        setNewMembers([...members].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));

        // Simulating network delay for refresh effect
        setTimeout(() => setIsRefreshing(false), 800);
    }, []);

    // Initial Load & Auto Refresh
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, [loadData]);


    const downloadCSV = () => {
        if (dailyOrders.length === 0) {
            alert("No orders to export for this period.");
            return;
        }
        const headers = ["Order ID", "Date", "Customer Name", "Email", "Items", "Total Amount", "Status"];
        const rows = dailyOrders.map(order => [
            order.id,
            new Date(order.date).toLocaleString(),
            `"${order.customerName}"`,
            order.customerEmail,
            `"${order.items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}"`,
            order.totalAmount,
            order.status
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daily_orders_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDocsClick = () => {
        // Open a simple help modal or redirect
        const width = 600;
        const height = 400;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        const w = window.open('', '_blank', `width=${width},height=${height},top=${top},left=${left}`);
        if (w) {
            w.document.write('<html><head><title>Admin Docs</title><style>body{font-family:sans-serif;padding:2rem;}</style></head><body><h1>Admin Documentation</h1><p>Welcome to the Admin Panel Guide.</p><h2>Managing Orders</h2><p>Click on Orders to view details.</p><h2>Exporting Data</h2><p>Use the Export button to download CSV files.</p><button onclick="window.close()" style="margin-top:20px;padding:10px 20px;">Close Window</button></body></html>');
            w.document.close();
        }
    };

    const StatCard = ({ title, value, subValue, icon: Icon, trend, color }: any) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
                {subValue && <div className="text-xs text-slate-400 mt-1">{subValue}</div>}
            </div>
        </motion.div>
    );

    return (
        <div>
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        Dashboard Overview
                        {isRefreshing && <RefreshCw size={16} className="text-slate-400 animate-spin" />}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Welcome back, here's what's happening today.
                        <span className="text-xs ml-2 text-slate-400 font-mono">
                            Last updated: {new Date().toLocaleTimeString()}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {['Today', '7 Days', '30 Days', 'Year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeRange === range
                                ? 'bg-slate-900 text-white shadow'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    subValue="Total accumulated revenue"
                    icon={DollarSign}
                    trend={12.5}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Active Orders"
                    value={stats.ordersDaily}
                    subValue={`vs. ${stats.ordersMonthly} this month`}
                    icon={ShoppingBag}
                    trend={8.2}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Users"
                    value={stats.users.toLocaleString()}
                    subValue="Registered members"
                    icon={Users}
                    trend={-2.4}
                    color="bg-violet-500"
                />
                <StatCard
                    title="Conversion Rate"
                    value="3.2%"
                    subValue="Average across all channels"
                    icon={TrendingUp}
                    trend={4.1}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Table Section */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Daily Transactions</h3>
                                <p className="text-sm text-slate-500">Orders from 12:01 PM Yesterday to 12:00 PM Today</p>
                            </div>
                            <div className="flex gap-2">
                                <button title="Filter Orders" onClick={() => alert('Filter feature coming soon!')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <Filter size={18} />
                                </button>
                                <button title="More Options" onClick={() => alert('More options: Print, Share, etc.')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                                <button
                                    onClick={downloadCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    <Download size={16} />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {dailyOrders.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No orders found for this period</p>
                                    <p className="text-slate-400 text-sm mt-1">Check back later or change filter</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Order info</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Customer</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {dailyOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate('/admin/orders')}>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-700 flex items-center gap-2">
                                                        #{order.id}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                            {order.customerName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-700">{order.customerName}</div>
                                                            <div className="text-xs text-slate-400">{order.customerEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                        {order.status || 'Completed'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-sm font-bold text-slate-800">
                                                        ${Number(order.totalAmount).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-slate-400">Paid</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                            <Link to="/admin/orders" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                                View Full Order History <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column (Members & Activity) */}
                <div className="flex flex-col gap-6">
                    {/* New Members Widget */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 text-lg">New Members</h3>
                            <Link to="/admin/members" className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors">
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>

                        {newMembers.length === 0 ? (
                            <div className="text-center text-slate-400 py-8">No new members</div>
                        ) : (
                            <div className="space-y-4">
                                {newMembers.map((member: any, i: number) => (
                                    <div key={member.id || i} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/admin/members')}>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${member.type && member.type.toLowerCase().includes('company') ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                                                    <span className="text-[8px] text-white font-bold">{member.type && member.type.toLowerCase().includes('company') ? 'B' : 'P'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{member.name}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                                    Joined {member.date || 'Today'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/admin/members')}
                            className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Manage Users
                        </button>
                    </div>

                    {/* Quick Action Widget */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg runux-card text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                            <p className="text-slate-300 text-sm mb-4">Check our documentation for admin tools and features.</p>
                            <button
                                onClick={handleDocsClick}
                                className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-50 transition-colors"
                            >
                                View Docs
                            </button>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
