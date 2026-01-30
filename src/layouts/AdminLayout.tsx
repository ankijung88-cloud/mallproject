import type { ReactNode } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    CreditCard,
    RotateCcw,
    Users,
    Settings,
    LogOut,
    Archive,
    FileText,
    Search,
    Bell,
    Menu,
    X,
    ChevronRight,
    User,
    MessageSquare
} from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
        { title: 'Commerce' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/products', icon: Archive, label: 'Inventory' },
        { path: '/admin/shipping', icon: Package, label: 'Fulfillment' },
        { title: 'Finance' },
        { path: '/admin/payments', icon: CreditCard, label: 'Transactions' },
        { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
        { path: '/admin/returns', icon: RotateCcw, label: 'Returns' },
        { title: 'Management' },
        { path: '/admin/members', icon: Users, label: 'Customers' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const currentTitle = navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

    // Mock Notifications
    const notifications = [
        { id: 1, title: 'New Order #1234', time: '5m ago', type: 'order' },
        { id: 2, title: 'Low Stock Alert: Desk Chair', time: '1h ago', type: 'alert' },
        { id: 3, title: 'New Member Registration', time: '2h ago', type: 'user' },
    ];

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results: any[] = [];

        // 1. Search Navigation
        navItems.forEach(item => {
            if (item.path && item.label && item.label.toLowerCase().includes(query)) {
                results.push({ type: 'Page', title: item.label, path: item.path });
            }
        });

        // 2. Search Orders (Mock from LocalStorage)
        const storedOrders = JSON.parse(localStorage.getItem('mall_orders') || '[]');
        storedOrders.forEach((order: any) => {
            if (order.id.toString().includes(query) || order.customerName.toLowerCase().includes(query)) {
                results.push({ type: 'Order', title: `Order #${order.id} - ${order.customerName}`, path: '/admin/orders' });
            }
        });

        // 3. Search Members
        const storedMembers = JSON.parse(localStorage.getItem('mall_members') || '[]');
        storedMembers.forEach((member: any) => {
            if (member.name.toLowerCase().includes(query) || member.email?.toLowerCase().includes(query)) {
                results.push({ type: 'Member', title: `${member.name} (${member.type})`, path: '/admin/members' });
            }
        });

        setSearchResults(results.slice(0, 5)); // Limit to 5
        setIsSearchOpen(true);
    }, [searchQuery]);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed md:relative z-30 h-full bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800",
                    isSidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:w-0 md:-translate-x-0"
                )}
                style={{ width: isSidebarOpen ? '18rem' : '0', transform: isSidebarOpen ? 'translateX(0)' : undefined }}
            >
                <div className="p-6 h-16 flex items-center justify-between border-b border-slate-800 min-w-[18rem]">
                    <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">A</div>
                        Admin<span className="text-blue-500">Panel</span>
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar min-w-[18rem]">
                    {navItems.map((item, idx) => {
                        if (item.title) {
                            return (
                                <div key={idx} className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {item.title}
                                </div>
                            );
                        }
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path!}
                                end={item.end}
                                className={({ isActive }) => clsx(
                                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 shadow-sm border border-blue-600/20"
                                        : "hover:bg-slate-800/50 hover:text-white text-slate-400"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon size={18} className={isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"} />}
                                            {item.label}
                                        </div>
                                        {isActive && <ChevronRight size={14} />}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-800 min-w-[18rem]">

                    <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 mb-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                            AD
                        </div>
                        <div>
                            <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Administrator</div>
                            <div className="text-xs text-slate-500">Super Admin</div>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 py-2.5 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider border border-slate-700 hover:border-red-500/50"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-full bg-gray-50/50 relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">{currentTitle}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block w-64" ref={searchRef}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search pages, orders, members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            />
                            {/* Search Dropdown */}
                            {isSearchOpen && searchQuery && (
                                <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    navigate(result.path);
                                                    setIsSearchOpen(false);
                                                    setSearchQuery('');
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                            >
                                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">{result.type}</div>
                                                <div className="text-sm text-gray-800 font-medium">{result.title}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500">No results found.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                            <span className="font-bold text-sm text-gray-800">Notifications</span>
                                            <span className="text-xs text-blue-600 font-medium cursor-pointer">Mark all as read</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map(notif => (
                                                <div key={notif.id} className="px-4 py-3 border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-sm font-semibold text-gray-800">{notif.title}</span>
                                                        <span className="text-[10px] text-gray-400">{notif.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Click to view details.</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 bg-gray-50 text-center">
                                            <Link to="/admin/settings" className="text-xs text-gray-500 hover:text-gray-800">View all notifications</Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-8 bg-gray-200 mx-1"></div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                                    <User size={16} />
                                </div>
                            </button>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <div className="text-sm font-bold text-gray-800">Administrator</div>
                                            <div className="text-xs text-gray-500">super@admin.com</div>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/admin/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Account Settings
                                            </Link>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => { setIsProfileOpen(false); alert('Help docs opened!'); }}
                                            >
                                                Help & Support
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-100 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
