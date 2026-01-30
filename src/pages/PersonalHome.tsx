import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { PriceDisplay } from '../components/PriceDisplay';
import MainLayout from '../layouts/MainLayout';
import { ShoppingCart, ArrowRight, Star, TrendingUp, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function PersonalHome() {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { toggleWishlist, isInWishlist } = useWishlistStore();

    // Extract unique categories
    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const displayedProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const featuredProduct = products.find(p => p.id === 2); // Headphones as featured

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login?type=personal');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.personalPrice,
            image: product.image
        });
    };

    const handleWishlistToggle = (e: React.MouseEvent, productId: number) => {
        e.stopPropagation();
        toggleWishlist(productId);
    };

    const handleLookbookClick = () => {
        const shopSection = document.getElementById('shop-section');
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen">
                {/* Modern Hero Section */}
                <section className="relative h-[85vh] overflow-hidden bg-black text-white">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2070"
                            alt="Fashion Hero"
                            className="w-full h-full object-cover opacity-70"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

                    <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className="max-w-2xl"
                        >
                            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/30 uppercase tracking-wider backdrop-blur-sm">
                                    New Collection 2026
                                </span>
                            </motion.div>
                            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
                                DEFINE <br />
                                YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">STYLE</span>
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 mb-8 font-light max-w-lg leading-relaxed">
                                Discover a curated selection of premium essentials designed for the modern lifestyle. Elevate your everyday.
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLookbookClick}
                                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                >
                                    Start Shopping <ArrowRight size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLookbookClick}
                                    className="px-8 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 text-white backdrop-blur-sm transition-colors"
                                >
                                    View Lookbook
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Trending Ticker */}
                <div className="bg-emerald-900 overflow-hidden py-3">
                    <div className="flex gap-10 sm:gap-20 text-emerald-100/60 font-medium text-sm w-max animate-marquee whitespace-nowrap">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="flex items-center gap-2">
                                <Zap size={14} className="text-emerald-400" /> FREE SHIPPING ON ORDERS OVER $50
                                <span className="text-emerald-700 mx-4">•</span>
                                <Star size={14} className="text-emerald-400" /> NEW ARRIVALS WEEKLY
                            </span>
                        ))}
                    </div>
                </div>

                {/* Category Navigation */}
                <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                    ? 'bg-black text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    } capitalize`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Featured Product Breakout */}
                {featuredProduct && selectedCategory === 'all' && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                        <div className="bg-gray-900 rounded-[3rem] overflow-hidden grid md:grid-cols-2 text-white relative items-center">
                            <div className="p-12 md:p-20 relative z-10">
                                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold tracking-wider uppercase mb-4">
                                    <TrendingUp size={16} /> Editor's Choice
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">{featuredProduct.name}</h2>
                                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                    {featuredProduct.description}
                                </p>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="text-4xl font-bold text-white">
                                        <PriceDisplay amount={featuredProduct.personalPrice} />
                                    </div>
                                    <div className="text-gray-500 line-through text-xl">
                                        <PriceDisplay amount={Math.round(featuredProduct.personalPrice * 1.2)} />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={(e) => handleAddToCart(e, featuredProduct)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                    >
                                        Add to Cart <ShoppingCart size={20} />
                                    </button>
                                    <button
                                        onClick={(e) => handleWishlistToggle(e, featuredProduct.id)}
                                        className={`p-4 rounded-full border border-slate-700 transition-colors ${isInWishlist(featuredProduct.id) ? 'bg-white text-black border-white' : 'hover:bg-slate-800 text-white'}`}
                                    >
                                        <Star size={20} fill={isInWishlist(featuredProduct.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                            <div className="relative h-full min-h-[400px]">
                                <img
                                    src={featuredProduct.image}
                                    alt={featuredProduct.name}
                                    className="absolute inset-0 w-full h-full object-cover md:rounded-l-[3rem]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-900 via-transparent to-transparent" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Product Grid */}
                <section id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Drops</h2>
                            <p className="text-gray-500">Explore the freshest additions to our collection</p>
                        </div>
                        <div className="hidden sm:block text-sm text-gray-400">
                            Showing {displayedProducts.length} items
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {displayedProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden mb-5">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                        {/* Floating Actions */}
                                        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="w-full bg-white/90 backdrop-blur-md text-black py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart size={18} /> Add to Cart
                                            </button>
                                        </div>

                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={(e) => handleWishlistToggle(e, product.id)}
                                                className={`p-2 rounded-full bg-white/80 backdrop-blur transition-colors ${isInWishlist(product.id) ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-600 hover:bg-black hover:text-white'}`}
                                            >
                                                <Star size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                                            {product.category}
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="text-lg font-bold text-gray-900 shrink-0">
                                                <PriceDisplay amount={product.personalPrice} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {displayedProducts.length === 0 && (
                        <div className="py-20 text-center text-gray-500 bg-gray-100 rounded-3xl">
                            <p className="text-xl">No products found in this category.</p>
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className="mt-4 text-emerald-600 font-bold hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}
