import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingBag, LogOut, ShoppingCart, LogIn, ClipboardList, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { userType: authUserType, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { toggleCart, totalItems } = useCart();

    // Determine context based on Auth, URL path, or Query Param
    // If authenticated, trust the userType.
    // If not, check if we are on a company page OR have type=company param.
    const isCompanyContext =
        authUserType === 'company' ||
        (!isAuthenticated && (location.pathname.startsWith('/company') || searchParams.get('type') === 'company'));

    const contextType = isCompanyContext ? 'company' : 'personal';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            navigate(`/login?type=${contextType}`);
            return;
        }
        action();
    };

    const handleFooterLink = (e: React.MouseEvent, link: string) => {
        e.preventDefault();
        alert(`${link} page is under construction.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className={clsx(
                "bg-white shadow-sm sticky top-0 z-50 transition-colors duration-300",
                isCompanyContext ? "border-b-4 border-blue-600" : "border-b-4 border-emerald-500"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to={isCompanyContext ? '/company' : '/personal'} className="flex items-center space-x-2">
                            <div className={clsx(
                                "p-2 rounded-lg text-white",
                                isCompanyContext ? "bg-blue-600" : "bg-emerald-500"
                            )}>
                                <ShoppingBag size={24} />
                            </div>
                            <span className="text-xl font-bold text-gray-800">
                                {isCompanyContext ? 'BizMall' : 'LifeStyle'}
                            </span>
                        </Link>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleAuthAction(() => navigate('/order-history'))}
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                title="Order History"
                            >
                                <ClipboardList size={24} />
                            </button>

                            <button
                                onClick={() => handleAuthAction(toggleCart)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className={clsx(
                                        "absolute -top-1 -right-1 text-xs font-bold text-white px-1.5 py-0.5 rounded-full",
                                        isCompanyContext ? "bg-blue-600" : "bg-emerald-500"
                                    )}>
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            <span className="text-sm font-medium text-gray-500">
                                {isCompanyContext ? '기업 회원' : '개인 회원'}
                            </span>
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>로그아웃</span>
                                </button>
                            ) : (
                                <Link
                                    to={`/login?type=${contextType}`}
                                    className={clsx(
                                        "flex items-center space-x-1 transition-colors",
                                        isCompanyContext ? "text-blue-600 hover:text-blue-800" : "text-emerald-500 hover:text-emerald-700"
                                    )}
                                >
                                    <LogIn size={18} />
                                    <span>로그인</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <CartModal />

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">회사 소개</h3>
                        <p className="text-gray-400 mb-4">{isCompanyContext ? '기업' : '모두'}를 위한 맞춤형 프리미엄 쇼핑 경험을 제공합니다.</p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                                <Facebook size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">
                                <Twitter size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                                <Instagram size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer">
                                <Mail size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">고객 센터</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" onClick={(e) => handleFooterLink(e, 'Inquiry')} className="hover:text-white transition-colors">문의하기</a></li>
                            <li><a href="#" onClick={(e) => handleFooterLink(e, 'Shipping Policy')} className="hover:text-white transition-colors">배송 정책</a></li>
                            <li><a href="#" onClick={(e) => handleFooterLink(e, 'Returns & Refunds')} className="hover:text-white transition-colors">반품 및 환불</a></li>
                            <li><a href="#" onClick={(e) => handleFooterLink(e, 'Privacy Policy')} className="hover:text-white transition-colors">개인정보 처리방침</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">뉴스레터</h3>
                        <p className="text-gray-400 mb-4">최신 소식과 프로모션 정보를 받아보세요.</p>
                        <div className="flex">
                            <input type="email" placeholder="이메일 주소" className="flex-1 bg-gray-800 border-none rounded-l-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            <button className={clsx(
                                "px-4 py-2 rounded-r-lg font-bold text-sm transition-colors",
                                isCompanyContext ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-500 hover:bg-emerald-600"
                            )}>구독</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © 2024 {isCompanyContext ? 'BizMall Inc.' : 'LifeStyle Shop'}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
