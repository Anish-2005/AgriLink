'use client'
import Link from 'next/link';
import { useUser } from '@civic/auth/react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Star, Menu, X, ArrowRight, Leaf, Zap, Users, TrendingUp, CheckCircle, Camera, Wallet, BarChart2, Leaf as LucideLeaf, User, LogOut, LayoutDashboard } from 'lucide-react';

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
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-xl blur opacity-75"></div>
                                <div className="relative bg-gradient-to-r from-lime-400 to-emerald-400 p-2 rounded-xl">
                                    <Leaf className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight drop-shadow-lg border-b-4 border-emerald-500 pb-1">
                                AgriLink
                            </span>
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
                            <div className="hidden md:flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-extrabold text-emerald-800">
                                        {user?.name || user?.email?.split('@')[0] || 'Farmer'}
                                    </p>
                                    <p className="text-xs text-emerald-600 font-semibold">
                                        Premium Member
                                    </p>
                                </div>
                                
                                {/* User Avatar */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 flex items-center justify-center text-white font-extrabold border-2 border-emerald-600 shadow-lg">
                                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'F'}
                                    </div>
                                    
                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-emerald-500 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                                        <div className="py-2">
                                            <div className="px-4 py-3 border-b border-emerald-100">
                                                <p className="text-sm font-extrabold text-emerald-800 truncate">{user?.email}</p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 font-semibold"
                                            >
                                                <User className="h-4 w-4 mr-2" /> Profile Settings
                                            </Link>
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 font-semibold"
                                            >
                                                <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold border-t border-emerald-100"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:block group relative px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500"
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    <span>Get Started</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
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