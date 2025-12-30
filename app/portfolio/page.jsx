'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useUser } from '@civic/auth/react';
import { FiFilter, FiSearch, FiDollarSign, FiTrendingUp, FiCalendar, FiPackage, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getWasteListingsByUser } from '../actions/mongodbfunctions';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { ArrowRight, Leaf, Zap, Star, TrendingUp, Users, Globe, CheckCircle, Shield, BarChart3, FileText, Download, Filter } from 'lucide-react';
import * as THREE from 'three';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  const { user } = useUser();
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalWeight: 0,
    averagePrice: 0,
    transactions: 0,
  });
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch sales data
  const fetchUserSales = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const sales = await getWasteListingsByUser(user.id);
      const transformedSales = sales.map(sale => ({
        id: sale._id.toString(),
        item: sale.cropType || 'Agricultural Waste',
        price: sale.classificationResult?.estimatedValue || 0,
        weight: parseFloat(sale.quantity) || 0,
        quantityUnit: sale.quantityUnit || 'kg',
        time: sale.createdAt || new Date().toISOString(),
        status: sale.status || 'pending',
        imageUrl: sale.imageUrl || null,
        wasteDescription: sale.wasteDescription || '',
        moistureLevel: sale.moistureLevel || '',
        ageOfWaste: sale.ageOfWaste || '',
        location: sale.location || '',
        additionalNotes: sale.additionalNotes || '',
      }));

      setSalesData(transformedSales);
      setFilteredData(transformedSales);

      const completed = transformedSales.filter(item => item.status === 'completed');
      const totalSales = completed.reduce((sum, item) => sum + (item.price * item.weight), 0);
      const totalWeight = completed.reduce((sum, item) => sum + item.weight, 0);
      const averagePrice = totalWeight > 0 ? totalSales / totalWeight : 0;

      setStats({
        totalSales,
        totalWeight,
        averagePrice,
        transactions: completed.length,
      });
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData([]);
      setFilteredData([]);
      setStats({ totalSales: 0, totalWeight: 0, averagePrice: 0, transactions: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSales();
  }, [user?.id]);

  // Filter and sort functionality
  useEffect(() => {
    let results = [...salesData];

    if (searchTerm) {
      results = results.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.wasteDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      results = results.filter(item => item.status === activeFilter);
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(results);
  }, [searchTerm, sortConfig, activeFilter, salesData]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    return status === 'completed'
      ? <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-xs font-extrabold rounded-full shadow-md">Completed</span>
      : <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-extrabold rounded-full shadow-md">Pending</span>;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const refreshData = () => {
    fetchUserSales();
  };

  // Sample data for unauthenticated users
  const sampleStats = {
    totalSales: 120000,
    totalWeight: 3500,
    averagePrice: 34,
    transactions: 12,
  };
  const sampleSales = [
    {
      id: 'sample1',
      item: 'Rice Straw',
      price: 32,
      weight: 500,
      quantityUnit: 'kg',
      time: '2025-12-01T10:00:00Z',
      status: 'completed',
      imageUrl: null,
      wasteDescription: 'Dry rice straw, baled',
      moistureLevel: 'Low',
      ageOfWaste: '2 days',
      location: 'Punjab',
      additionalNotes: 'Ready for pickup',
    },
    {
      id: 'sample2',
      item: 'Sugarcane Bagasse',
      price: 36,
      weight: 800,
      quantityUnit: 'kg',
      time: '2025-11-20T14:30:00Z',
      status: 'pending',
      imageUrl: null,
      wasteDescription: 'Fresh bagasse from mill',
      moistureLevel: 'Medium',
      ageOfWaste: '1 day',
      location: 'Maharashtra',
      additionalNotes: '',
    },
    {
      id: 'sample3',
      item: 'Wheat Husk',
      price: 34,
      weight: 300,
      quantityUnit: 'kg',
      time: '2025-10-15T09:00:00Z',
      status: 'completed',
      imageUrl: null,
      wasteDescription: 'Clean, dry husk',
      moistureLevel: 'Low',
      ageOfWaste: '3 days',
      location: 'Haryana',
      additionalNotes: 'Stored in shed',
    },
  ];

  const isSample = !user;
  const displayStats = isSample ? sampleStats : stats;
  const displaySales = isSample ? sampleSales : filteredData;
  const displaySalesData = isSample ? sampleSales : salesData;

  const portfolioStats = [
    { 
      label: 'Total Earnings', 
      value: formatCurrency(displaySales.filter(item => item.status === 'completed').reduce((sum, item) => sum + (item.price * item.weight), 0)),
      icon: FiDollarSign,
      color: 'from-emerald-500 to-lime-500'
    },
    { 
      label: 'Avg. Price', 
      value: `₹${(() => {
        const completed = displaySales.filter(item => item.status === 'completed');
        const totalSales = completed.reduce((sum, item) => sum + (item.price * item.weight), 0);
        const totalWeight = completed.reduce((sum, item) => sum + item.weight, 0);
        return Math.round(totalWeight > 0 ? totalSales / totalWeight : 0);
      })()}/${displaySales[0]?.quantityUnit || 'kg'}`,
      icon: FiTrendingUp,
      color: 'from-amber-500 to-orange-500'
    },
    { 
      label: 'Total Listed', 
      value: `${displaySales.filter(item => item.status === 'completed').reduce((sum, item) => sum + item.weight, 0)} ${displaySales[0]?.quantityUnit || 'kg'}`,
      icon: FiPackage,
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      label: 'Listings', 
      value: displaySales.filter(item => item.status === 'completed').length,
      icon: FiCalendar,
      color: 'from-violet-500 to-purple-500'
    }
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
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                <span className="text-base font-extrabold text-emerald-700">Portfolio Dashboard</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
                Your Waste
                <span className="block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                  Trading Portfolio
                </span>
              </h1>

              <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
                Track all your agricultural waste listings, earnings, and transaction history in one comprehensive dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
                  <span className="flex items-center justify-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Download Report</span>
                  </span>
                </button>

                <button
                  onClick={refreshData}
                  className="group px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {portfolioStats.map((stat, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-xl`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-emerald-700 font-bold">{stat.label}</p>
                          <p className="text-xl font-extrabold text-emerald-800">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-2 rounded-xl">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800">Farmer Rating</p>
                      <div className="flex items-center">
                        <span className="text-xl font-extrabold text-amber-800 mr-2">4.8</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-lime-500 border-y-4 border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: displaySales.length.toString(), label: 'Active Listings', icon: FileText },
              { value: `${Math.round(displayStats.averagePrice)}`, label: 'Avg. Price/Kg', icon: TrendingUp },
              { value: '98%', label: 'Success Rate', icon: CheckCircle },
              { value: '₹850', label: 'Avg. CO₂ Value', icon: Leaf }
            ].map((stat, idx) => (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-emerald-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search items or descriptions..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'completed', 'pending'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-extrabold transition-all duration-300 border-2 capitalize ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white border-emerald-600 shadow-lg'
                      : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none"
                value={sortConfig.key}
                onChange={(e) => requestSort(e.target.value)}
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price: High to Low</option>
                <option value="weight">Quantity: High to Low</option>
                <option value="item">Item Name</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="text-sm text-emerald-700 font-semibold">
            Showing <span className="font-extrabold">{displaySales.length}</span> of{' '}
            <span className="font-extrabold">{displaySalesData.length}</span> listings
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100">
              <thead className="bg-gradient-to-r from-emerald-50 to-lime-50">
                <tr>
                  {[
                    { key: 'item', label: 'Item', sortable: true },
                    { key: 'price', label: 'Price', sortable: true, align: 'right' },
                    { key: 'weight', label: 'Quantity', sortable: true, align: 'right' },
                    { key: 'time', label: 'Date', sortable: true, align: 'right' },
                    { key: 'total', label: 'Total', sortable: false, align: 'right' },
                    { key: 'status', label: 'Status', sortable: false, align: 'right' }
                  ].map((column, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className={`px-6 py-4 text-left text-xs font-extrabold text-emerald-800 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:text-emerald-600' : ''
                      } ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                      onClick={column.sortable ? () => requestSort(column.key) : undefined}
                    >
                      <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : ''}`}>
                        {column.label}
                        {column.sortable && sortConfig.key === column.key && (
                          sortConfig.direction === 'asc' ? 
                            <FiChevronUp className="ml-1 h-4 w-4" /> : 
                            <FiChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-100">
                {displaySales.length > 0 ? (
                  displaySales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-emerald-50 transition-colors duration-300 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-emerald-100 to-lime-100 rounded-xl border-2 border-emerald-300 flex items-center justify-center">
                            {sale.item?.charAt(0) || 'A'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-extrabold text-emerald-800">{sale.item}</div>
                            <div className="text-sm text-emerald-700 font-semibold">{sale.wasteDescription}</div>
                            <div className="flex items-center mt-1">
                              <Shield className="h-3 w-3 text-emerald-600 mr-1" />
                              <div className="text-xs text-emerald-600">ID: {sale.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-emerald-800">
                        ₹{sale.price}/{sale.quantityUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-emerald-700 font-semibold">
                        {sale.weight} {sale.quantityUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-emerald-700 font-semibold">
                        {formatDate(sale.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-extrabold text-emerald-800">
                        {formatCurrency(sale.price * sale.weight)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {getStatusBadge(sale.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-lime-100 border-2 border-emerald-300 mb-6">
                          <FiPackage className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">No listings found</h3>
                        <p className="text-emerald-700 font-semibold mb-8 max-w-md">
                          Try adjusting your search or filter criteria, or start selling your agricultural waste
                        </p>
                        <button className="group relative px-8 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-500">
                          <span className="flex items-center space-x-2">
                            <span>Start Selling Waste</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary */}
          {displaySales.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-lime-50 px-6 py-4 border-t-2 border-emerald-300">
              <div className="flex justify-between items-center">
                <div className="text-emerald-800 font-semibold">
                  <span className="font-extrabold">{displaySales.length}</span> listings shown •{' '}
                  <span className="font-extrabold">{displaySalesData.length}</span> total
                </div>
                <div className="flex space-x-8">
                  <div className="text-right">
                    <p className="text-sm text-emerald-700 font-bold">Total Quantity</p>
                    <p className="text-lg font-extrabold text-emerald-800">
                      {displaySales.reduce((sum, item) => sum + item.weight, 0)} {displaySalesData[0]?.quantityUnit || 'kg'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-700 font-bold">Total Value</p>
                    <p className="text-lg font-extrabold text-emerald-800">
                      {formatCurrency(
                        displaySales.reduce((sum, item) => sum + (item.price * item.weight), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-500">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-emerald-800 drop-shadow-lg">Listing Performance</h2>
              <p className="text-emerald-900 font-semibold mt-2">Monthly earnings and listing trends</p>
            </div>
            <div className="flex space-x-2">
              {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-xl font-extrabold transition-all duration-300 border-2 ${
                    period === 'Monthly'
                      ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white border-emerald-600 shadow-lg'
                      : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 flex items-end justify-center space-x-6 pb-8">
            {[45, 70, 100, 85, 125, 95, 65].map((height, index) => (
              <div key={index} className="relative flex flex-col items-center w-12" data-aos="fade-up" data-aos-delay={index * 100}>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-lime-400 rounded-t-2xl transition-all duration-1000 ease-out shadow-lg"
                  style={{ height: `${height}px` }}
                />
                <div className="mt-3 text-sm font-bold text-emerald-700">
                  {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-extrabold text-emerald-800">
                  ₹{height * 1000}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { 
                label: 'Highest Listing', 
                value: '₹28,500', 
                subtext: 'Rice Straw • 850kg',
                color: 'from-emerald-500 to-teal-500'
              },
              { 
                label: 'Avg. Price/Kg', 
                value: `₹${Math.round(displayStats.averagePrice)}`, 
                subtext: 'Based on completed listings',
                color: 'from-amber-500 to-orange-500'
              },
              { 
                label: 'Top Item', 
                value: displaySalesData[0]?.item || 'Rice Straw', 
                subtext: `${displayStats.totalWeight}kg listed`,
                color: 'from-blue-500 to-indigo-500'
              },
              { 
                label: 'Recent Listing', 
                value: formatCurrency(displaySalesData[0]?.price * displaySalesData[0]?.weight || 0), 
                subtext: displaySalesData[0]?.item || 'Wheat Straw',
                color: 'from-violet-500 to-purple-500'
              }
            ].map((metric, idx) => (
              <div key={idx} className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 rounded-2xl p-6">
                <p className="text-sm font-bold text-emerald-700 mb-2">{metric.label}</p>
                <p className="text-2xl font-extrabold text-emerald-800">{metric.value}</p>
                <p className="text-xs text-emerald-600 mt-1">{metric.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50 border-y-4 border-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-6">
            Grow Your Agricultural Portfolio
          </h2>
          <p className="text-xl text-emerald-900 mb-10 font-semibold">
            Maximize your earnings and track performance with our comprehensive portfolio dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
              <span className="flex items-center justify-center space-x-2">
                <span>Upload New Waste</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
              View Market Insights
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

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