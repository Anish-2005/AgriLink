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

export default function MarketplacePage() {
  // Three.js animated background setup
  const threeCanvasRef = useRef(null);
  useEffect(() => {
    let renderer, scene, camera, animationId;
    if (!threeCanvasRef.current) return;
    
    // Init scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
    renderer = new THREE.WebGLRenderer({ canvas: threeCanvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add subtle animated pattern
    const dots = [];
    const dotCount = 24;
    for (let i = 0; i < dotCount; i++) {
      const geometry = new THREE.SphereGeometry(0.045, 12, 12);
      const material = new THREE.MeshBasicMaterial({ color: 0x7ed957, transparent: true, opacity: 0.18 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.sin((i / dotCount) * Math.PI * 2) * 3.5;
      mesh.position.y = Math.cos((i / dotCount) * Math.PI * 2) * 2.2;
      mesh.position.z = Math.random() * 0.8 - 0.4;
      scene.add(mesh);
      dots.push(mesh);
    }
    
    // Animate
    const animate = () => {
      const t = Date.now() * 0.00018;
      dots.forEach((dot, i) => {
        dot.position.x = Math.sin(t + i) * 3.5;
        dot.position.y = Math.cos(t + i) * 2.2;
      });
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // State management
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.title = "AgriLink | Marketplace";
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch tenders
  useEffect(() => {
    const fetchTenders = async () => {
      const mockTenders = await getMockTenders();
      setTenders(mockTenders);
      setFilteredTenders(mockTenders);
      setLoading(false);
    };
    fetchTenders();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let results = tenders;

    // Filter by search term
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
      <canvas ref={threeCanvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0}} />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span className="text-base font-extrabold text-emerald-700">Live Industrial Tenders</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
                Premium Market for
                <span className="block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                  Agricultural Waste
                </span>
              </h1>

              <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
                Connect directly with 500+ verified industries looking to purchase your agricultural waste at premium prices with instant payments.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
                  <span className="flex items-center justify-center space-x-2">
                    <span>Post Your Waste</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  How It Works
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold shadow-md">
                      {['T', 'B', 'P', 'M'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-emerald-900 mt-1 font-extrabold">Trusted by 500+ industrial buyers</p>
                </div>
              </div>
            </div>

            {/* Market Price Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-lime-400 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 font-bold uppercase tracking-wide">Current Market Price</p>
                    <p className="text-3xl font-extrabold text-emerald-800">₹1,850 / ton</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {marketPrices.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-emerald-200 last:border-0">
                      <span className="text-emerald-800 font-semibold">{item.waste}</span>
                      <span className="font-extrabold text-emerald-700">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800 font-semibold">
                    💡 Pro Tip: Prices updated daily based on demand and quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-lime-500 border-y-4 border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white group cursor-pointer" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold drop-shadow-lg mb-2">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-wide opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Search */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-2 border-emerald-500">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-emerald-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search tenders, companies, locations..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="quantity-high">Quantity: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Waste Type Filter */}
            <div>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none"
                  value={selectedWasteType}
                  onChange={(e) => setSelectedWasteType(e.target.value)}
                >
                  {wasteTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Tenders' },
              { id: 'open', label: 'Open' },
              { id: 'closing', label: 'Closing Soon' },
              { id: 'closed', label: 'Closed' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-extrabold transition-all duration-300 border-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white border-emerald-600 shadow-lg'
                    : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tenders Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTenders.map((tender, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-emerald-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-extrabold text-emerald-800 group-hover:text-emerald-900">{tender.title}</h3>
                        {getStatusBadge(tender.status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <p className="text-emerald-700 font-semibold">{tender.company} • Verified</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-200 rounded-xl px-3 py-1">
                      <span className="text-sm font-extrabold text-emerald-800">{tender.wasteType}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                      <p className="text-sm text-emerald-700 font-bold mb-1">Quantity</p>
                      <p className="text-2xl font-extrabold text-emerald-800">{tender.quantity} tons</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-700 font-bold mb-1">Price/Ton</p>
                      <p className="text-2xl font-extrabold text-amber-800">₹{tender.pricePerTon}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-700 font-bold">Location</p>
                          <p className="text-lg font-extrabold text-blue-800">{tender.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-violet-600" />
                        <div>
                          <p className="text-sm text-violet-700 font-bold">Deadline</p>
                          <p className="text-lg font-extrabold text-violet-800">{getDaysLeft(tender.deadline)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <p className="text-sm font-extrabold text-emerald-800 mb-3">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {tender.requirements.split(', ').map((req, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                          <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-emerald-100">
                    <div>
                      <p className="text-xs text-emerald-700 font-bold uppercase">Order Range</p>
                      <p className="text-lg font-extrabold text-emerald-800">{tender.minOrder} - {tender.maxOrder} tons</p>
                    </div>
                    <button
                      className={`px-6 py-3 rounded-xl font-extrabold transition-all duration-300 flex items-center space-x-2 ${
                        tender.status === 'closed'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'group relative bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                      }`}
                      disabled={tender.status === 'closed'}
                    >
                      {tender.status === 'closed' ? (
                        <>
                          <span>Closed</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingCart className="h-5 w-5" />
                          <span>Submit Bid</span>
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

        {/* How It Works Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-emerald-800 drop-shadow-lg mb-4">
              How the Marketplace Works
            </h2>
            <p className="text-xl text-emerald-900 drop-shadow-md font-semibold max-w-3xl mx-auto">
              Simple 3-step process to transform your waste into revenue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Find Tenders', desc: 'Browse industrial tenders looking for agricultural waste materials', color: 'from-emerald-500 to-teal-500' },
              { step: 2, title: 'Submit Bid', desc: 'Place competitive bids for your available agricultural waste', color: 'from-amber-500 to-orange-500' },
              { step: 3, title: 'Complete Transaction', desc: 'Finalize deal, arrange logistics, and get paid upon delivery', color: 'from-blue-500 to-indigo-500' }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay={idx * 200}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} mb-6`}>
                  <span className="text-2xl font-extrabold text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">{step.title}</h3>
                <p className="text-emerald-900 leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50 border-y-4 border-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-6">
            Ready to Monetize Your Agricultural Waste?
          </h2>
          <p className="text-xl text-emerald-900 mb-10 font-semibold">
            Join thousands of farmers already earning premium prices for their waste through AgriLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
              <span className="flex items-center justify-center space-x-2">
                <span>Start Selling Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
              View Pricing Guide
            </button>
          </div>
        </div>
      </section>

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

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

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