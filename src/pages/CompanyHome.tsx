import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { PriceDisplay } from '../components/PriceDisplay';
import MainLayout from '../layouts/MainLayout';
import { TrendingDown, ShieldCheck, Building2, Briefcase, Truck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/useAuthStore';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function CompanyHome() {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'all' | 'furniture' | 'electronics' | 'appliances'>('all');

    // Stats Logic
    const [stats, setStats] = useState({
        partners: 0,
        savings: 0,
        delivery: 0
    });

    useEffect(() => {
        // Calculate Stats from "DB" (LocalStorage/Products)
        const storedMembers = JSON.parse(localStorage.getItem('mall_members') || '[]');
        const companyMembers = storedMembers.filter((m: any) => m.type === 'company').length;

        // Calculate potential savings (Company Price vs Personal Price)
        let totalSavingPercent = 0;
        let pCount = 0;
        products.forEach(p => {
            if (p.personalPrice > 0 && p.companyPrice > 0) {
                totalSavingPercent += ((p.personalPrice - p.companyPrice) / p.personalPrice);
                pCount++;
            }
        });
        const avgSaving = pCount > 0 ? Math.round((totalSavingPercent / pCount) * 100) : 0;

        // Total Orders (Simulating "Fast Delivery" volume)
        const storedOrders = JSON.parse(localStorage.getItem('mall_orders') || '[]');
        const totalOrders = storedOrders.length;

        setStats({
            partners: companyMembers + 2500, // Base + Actual
            savings: avgSaving,
            delivery: totalOrders + 1500 // Base + Actual
        });
    }, [products]);


    // Filter products based on active tab and B2B recommendation
    const displayedProducts = products.filter(p => {
        if (!p.isRecommendedCompany) return false;
        if (activeTab === 'all') return true;
        return p.category.toLowerCase() === activeTab;
    });

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login?type=company');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.companyPrice,
            image: product.image
        });
    };

    const handleScheduleDemo = () => {
        const email = "sales@bizmall.com";
        const subject = "Demo Request for Enterprise Solution";
        const body = "Hello, I would like to schedule a demo for your enterprise procurement solutions.";
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <MainLayout>
            <div className="bg-slate-50 min-h-screen font-sans">
                {/* Professional Hero Section */}
                <section className="relative h-[85vh] flex items-center bg-slate-900 overflow-hidden text-white">
                    <div className="absolute inset-0 z-0">
                        {/* Abstract Geometric Overlay */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/40" />

                        {/* Animated Grid Lines */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className="max-w-3xl"
                        >
                            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider uppercase">
                                    Enterprise Solution
                                </span>
                                <span className="h-px w-8 bg-blue-500/50"></span>
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                                Procurement <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Simplified.</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-light">
                                Streamline your office supply chain with our premium B2B portal.
                                Exclusive tiered pricing, automated invoicing, and dedicated account management.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
                                    <Building2 size={20} /> Corporate Login
                                </button>
                                <button
                                    onClick={handleScheduleDemo}
                                    className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold py-4 px-8 rounded-lg transition-all"
                                >
                                    Schedule Demo
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Side Stats Floating (Dynamic) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute right-[5%] bottom-[15%] hidden lg:flex gap-6 items-end"
                    >
                        {[
                            { label: "Verified Partners", value: `${stats.partners.toLocaleString()}+`, icon: ShieldCheck },
                            { label: "Avg Savings", value: `${stats.savings}%`, icon: TrendingDown },
                            { label: "Deliveries", value: `${stats.delivery.toLocaleString()}+`, icon: Truck },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-5 rounded-xl min-w-[180px] shadow-2xl hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-green-400 text-xs font-mono bg-green-500/10 px-2 py-1 rounded">+12% YoY</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Dashboard-style Control Bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex gap-8">
                                {[
                                    { id: 'all', label: 'All Equipment' },
                                    { id: 'furniture', label: 'Office Furniture' },
                                    { id: 'electronics', label: 'IT Infrastructure' },
                                    { id: 'appliances', label: 'Appliances' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`relative h-16 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'text-blue-600'
                                            : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                Live Inventory Updated 2m ago
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industrial Grid Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {displayedProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={product.id}
                                    onClick={() => navigate(`/product/${product.id}?type=company`)}
                                    className="group bg-white rounded-lg border border-slate-200 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
                                >
                                    {/* Tech-style Header */}
                                    <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                            ID: P-{product.id.toString().padStart(4, '0')}
                                        </span>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-grow">
                                        <div className="relative h-48 mb-6 overflow-hidden rounded bg-slate-100 group-hover:bg-white transition-colors">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                -{Math.round(((product.personalPrice - product.companyPrice) / product.personalPrice) * 100)}%
                                            </div>
                                        </div>

                                        <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">
                                            {product.description}
                                        </p>

                                        {/* B2B Pricing Table Look */}
                                        <div className="bg-slate-50 rounded border border-slate-100 p-3 mb-4">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-xs text-slate-500">MSRP</span>
                                                <span className="text-xs text-slate-400 line-through"><PriceDisplay amount={product.personalPrice} /></span>
                                            </div>
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-xs font-bold text-blue-900">Partner Price</span>
                                                <span className="text-lg font-bold text-blue-700"><PriceDisplay amount={product.companyPrice} /></span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-auto">
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="col-span-1 border border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-900 text-xs font-bold py-2.5 rounded transition-all"
                                            >
                                                Request Sample
                                            </button>
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="col-span-1 bg-slate-900 text-white hover:bg-blue-600 text-xs font-bold py-2.5 rounded transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Briefcase size={12} /> Order Bulk
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </div>
        </MainLayout>
    );
}
