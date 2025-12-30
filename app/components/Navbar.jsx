'use client'
import Link from 'next/link';
import { useUser } from '@civic/auth/react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Star, Menu, X, ArrowRight, Zap, Users, TrendingUp, CheckCircle, Camera, Wallet, BarChart2, Leaf as LucideLeaf, User, LogOut, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
    const { user } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('/app');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            setActiveTab(savedTab);
        } else {
            setActiveTab(pathname);
        }
    }, [pathname]);

    const handleTabClick = (path) => {
        localStorage.setItem('activeTab', path);
        setActiveTab(path);
        setMobileMenuOpen(false);
    };

    const navItems = [
        { 
            label: 'Upload Waste', 
            href: '/app',
            icon: <Camera className="h-5 w-5" />
        },
        { 
            label: 'Marketplace', 
            href: '/marketplace',
            icon: <Wallet className="h-5 w-5" />
        },
        { 
            label: 'Portfolio', 
            href: '/portfolio',
            icon: <BarChart2 className="h-5 w-5" />
        },
        { 
            label: 'CO₂ Saved', 
            href: '/carbon',
            icon: <LucideLeaf className="h-5 w-5" />
        },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/session', { method: 'DELETE' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center">
                            <Logo size={44} showText={true} />
                        </Link>
                    </div>

                    {/* Navigation Tabs - Desktop */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => handleTabClick(item.href)}
                                className={`group px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                                    activeTab === item.href
                                        ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white shadow-lg shadow-emerald-400/40 border-2 border-emerald-600'
                                        : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 border-2 border-transparent hover:border-emerald-300'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-base font-extrabold uppercase tracking-wide">
                                    {item.label}
                                </span>
                                {activeTab === item.href && (
                                    <div className="w-2 h-2 rounded-full bg-white ml-1 animate-pulse"></div>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* User Profile & Actions */}
                    <div className="flex items-center space-x-6">
                        {/* User Info */}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl font-extrabold shadow-lg hover:bg-red-700 transition-all duration-300 border-2 border-red-500"
                            >
                                <LogOut className="h-5 w-5 mr-1" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold border-2 border-emerald-300">
                                <User className="h-5 w-5 mr-1" />
                                <span>Guest User</span>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-3 rounded-xl hover:bg-emerald-100 transition-colors border-2 border-emerald-300"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-emerald-700" />
                            ) : (
                                <Menu className="h-6 w-6 text-emerald-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 mt-2 mb-4">
                        <div className="px-4 py-6 space-y-2">
                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => handleTabClick(item.href)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        activeTab === item.href
                                            ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white shadow-lg'
                                            : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900'
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-base font-extrabold">{item.label}</span>
                                    {activeTab === item.href && (
                                        <CheckCircle className="h-5 w-5 ml-auto" />
                                    )}
                                </Link>
                            ))}
                            
                            {user ? (
                                <>
                                    <div className="pt-4 border-t border-emerald-200">
                                        <div className="flex items-center space-x-3 px-4 py-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 flex items-center justify-center text-white font-extrabold border-2 border-emerald-600">
                                                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'F'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-emerald-800">
                                                    {user?.name || user?.email?.split('@')[0] || 'Farmer'}
                                                </p>
                                                <p className="text-xs text-emerald-600 font-semibold">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-3 px-4 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            <span className="font-semibold">Profile</span>
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center space-x-3 px-4 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                        >
                                            <LayoutDashboard className="h-4 w-4 mr-2" />
                                            <span className="font-semibold">Dashboard</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg border-2 border-emerald-500 text-center"
                                >
                                    Sign In / Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            
        </nav>
    );
}