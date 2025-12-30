'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { FiFilter, FiSearch, FiShoppingCart, FiTrendingUp, FiMapPin, FiClock, FiCheck, FiX, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getMockTenders } from "../actions/mongodbfunctions";
import Link from 'next/link';
import { ArrowRight, Leaf, Zap, Star, TrendingUp, Users, Globe, CheckCircle, Filter, Calendar, Package, MapPin, Clock, Shield } from 'lucide-react';
import * as THREE from 'three';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import Filters from './components/Filters';
import TendersGrid from './components/TendersGrid';
import HowItWorks from './components/HowItWorks';
import MarketplaceCTA from './components/MarketplaceCTA';

export default function MarketplacePage() {
  // State declarations
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const threeCanvasRef = useRef(null);

  // Three.js animated background setup - simplified implementation
  useEffect(() => {
    // This would be your Three.js initialization code
    // For now, we'll just set up a placeholder
    if (typeof window !== 'undefined' && threeCanvasRef.current) {
      // Your Three.js setup would go here
    }
  }, []);

  // Fetch tenders
  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const data = await getMockTenders();
        setTenders(data);
        setFilteredTenders(data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
  }, []);

  // Filter and sort tenders
  useEffect(() => {
    let results = [...tenders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(tender =>
        tender.title.toLowerCase().includes(term) ||
        tender.company.toLowerCase().includes(term) ||
        tender.wasteType.toLowerCase().includes(term) ||
        tender.location.toLowerCase().includes(term)
      );
    }

    // Filter by waste type
    if (selectedWasteType !== 'All') {
      results = results.filter(tender => tender.wasteType === selectedWasteType);
    }

    // Filter by status tab
    if (activeTab !== 'all') {
      results = results.filter(tender => tender.status === activeTab);
    }

    // Sort results
    switch (sortOption) {
      case 'newest':
        results = [...results].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        break;
      case 'price-high':
        results = [...results].sort((a, b) => b.pricePerTon - a.pricePerTon);
        break;
      case 'price-low':
        results = [...results].sort((a, b) => a.pricePerTon - b.pricePerTon);
        break;
      case 'quantity-high':
        results = [...results].sort((a, b) => b.quantity - a.quantity);
        break;
      default:
        break;
    }

    setFilteredTenders(results);
  }, [searchTerm, selectedWasteType, sortOption, activeTab, tenders]);

  const wasteTypes = [
    'All', 'Rice Straw', 'Wheat Straw', 'Sugarcane Bagasse',
    'Corn Stalks', 'Cotton Stalks', 'Coconut Husks',
    'Banana Plant Waste', 'Mustard Stalks', 'Paddy Husk'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-xs font-extrabold rounded-full shadow-md">Open</span>;
      case 'closing':
        return <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-extrabold rounded-full shadow-md">Closing Soon</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-400 text-white text-xs font-extrabold rounded-full shadow-md">Closed</span>;
      default:
        return <span className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-400 text-white text-xs font-extrabold rounded-full shadow-md">Unknown</span>;
    }
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-red-600 font-extrabold">Expired</span>;
    if (diffDays === 0) return <span className="text-amber-600 font-extrabold">Today</span>;
    if (diffDays === 1) return <span className="text-emerald-600 font-extrabold">Tomorrow</span>;
    return <span className="text-emerald-700 font-extrabold">{diffDays} days left</span>;
  };

  const stats = [
    { value: '24', label: 'Active Tenders', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { value: '₹1,850', label: 'Avg. Price/Ton', icon: FiDollarSign, color: 'from-amber-500 to-orange-500' },
    { value: '1,247', label: 'Total Transactions', icon: Users, color: 'from-blue-500 to-indigo-500' },
    { value: '12.5 tons', label: 'Avg. CO₂ Saved', icon: Leaf, color: 'from-violet-500 to-purple-500' }
  ];

  const marketPrices = [
    { waste: 'Rice Straw', price: '₹1,650 - ₹2,100' },
    { waste: 'Wheat Straw', price: '₹1,900 - ₹2,400' },
    { waste: 'Sugarcane Bagasse', price: '₹1,400 - ₹1,800' },
    { waste: 'Coconut Husks', price: '₹2,200 - ₹2,800' }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas 
        ref={threeCanvasRef} 
        className="fixed inset-0 w-full h-full z-0 pointer-events-none" 
        style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0}} 
      />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Single instance */}
      <Hero marketPrices={marketPrices} />

      <StatsSection stats={stats} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Search */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
          selectedWasteType={selectedWasteType}
          setSelectedWasteType={setSelectedWasteType}
          wasteTypes={wasteTypes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tenders Grid */}
        <TendersGrid 
          filteredTenders={filteredTenders} 
          loading={loading} 
          getDaysLeft={getDaysLeft} 
          getStatusBadge={getStatusBadge} 
        />

        {/* No Results */}
        {!loading && filteredTenders.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-2 border-emerald-500" data-aos="fade-up">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-lime-100 mb-6">
              <FiX className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">No matching tenders found</h3>
            <p className="text-emerald-700 mb-8 font-semibold">
              Try adjusting your search or filter criteria to find available tenders
            </p>
            <button
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-lime-400 text-white rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-600"
              onClick={() => {
                setSearchTerm('');
                setSelectedWasteType('All');
                setActiveTab('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}

        <HowItWorks />
      </main>

      <MarketplaceCTA />

      {/* Footer */}
      <footer className="bg-white border-t-4 border-emerald-500 text-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-emerald-800">AgriLink Marketplace</span>
              </div>
              <p className="text-emerald-700 leading-relaxed max-w-md font-semibold">
                Premium platform connecting farmers with industrial buyers for agricultural waste materials. 
                95% satisfaction rate with instant payments.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-800 font-extrabold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/app" className="hover:text-emerald-500 transition-colors font-bold">Upload Waste</Link></li>
                <li><Link href="/marketplace" className="hover:text-emerald-500 transition-colors font-bold">Marketplace</Link></li>
                <li><Link href="/portfolio" className="hover:text-emerald-500 transition-colors font-bold">Portfolio</Link></li>
                <li><Link href="/carbon" className="hover:text-emerald-500 transition-colors font-bold">CO₂ Impact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-800 font-extrabold mb-4">Market Support</h3>
              <ul className="space-y-3 font-semibold">
                <li>support@agrilink.com</li>
                <li>+91 98765 43210</li>
                <li>24/7 Support Available</li>
                <li>Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-emerald-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-700 text-sm font-semibold">© 2025 AgriLink Marketplace. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}