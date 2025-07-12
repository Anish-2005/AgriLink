'use client';
import { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiShoppingCart, FiTrendingUp, FiMapPin, FiClock, FiCheck, FiX, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { getMockTenders } from "../actions/mongodbfunctions"
import Link from 'next/link';
export default function MarketplacePage() {
  // Set page title
  useEffect(() => {
    document.title = "AgriLink | Marketplace";
  }, []);
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');

  // Mock tender data
  useEffect(() => {
    // Simulate API call
    const a = async () => {

      const mockTenders = await getMockTenders();

      setTenders(mockTenders);
      setFilteredTenders(mockTenders);
      setLoading(false);
    }
    a();

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
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Open</span>;
      case 'closing':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Closing Soon</span>;
      case 'closed':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Closed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Unknown</span>;
    }
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Head>
        <title>AgriLink | Marketplace</title>
      </Head>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-green-200 opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-yellow-200 opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-orange-200 opacity-20 animate-blob"></div>
      </div>

      {/* Navigation */}
      <Navbar />


      {/* Hero Section */}
      < div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Industrial Tenders for Agricultural Waste
              </h1>
              <p className="text-xl text-green-100 max-w-2xl">
                Connect directly with industries looking to purchase your agricultural waste at premium prices.
              </p>
              <div className="flex space-x-4 pt-4">
                <button className="bg-white text-green-800 hover:bg-green-100 font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Post Your Waste
                </button>
                <button className="border-2 border-white text-white hover:bg-green-700 font-medium px-6 py-3 rounded-lg transition-all duration-300">
                  How It Works
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-yellow-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-green-300 border-opacity-30 shadow-xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-green-500 p-3 rounded-full">
                      <FiTrendingUp className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-green-200">Current Market Price</p>
                      <p className="text-2xl font-bold">₹1,850 / ton</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-green-700">
                      <span className="text-green-200">Rice Straw</span>
                      <span className="font-medium">₹1,650 - ₹2,100</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-green-700">
                      <span className="text-green-200">Wheat Straw</span>
                      <span className="font-medium">₹1,900 - ₹2,400</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-green-700">
                      <span className="text-green-200">Sugarcane Bagasse</span>
                      <span className="font-medium">₹1,400 - ₹1,800</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-200">Coconut Husks</span>
                      <span className="font-medium">₹2,200 - ₹2,800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Main Content */}
      < main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" >
        {/* Marketplace Stats */}
        < div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" >
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-500">Active Tenders</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-500">Avg. Price/Ton</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">₹1,850</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-500">Total Transactions</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">1,247</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-500">Avg. CO2 Saved</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">12.5 tons</p>
          </div>
        </div >

        {/* Filters and Search */}
        < div className="bg-white rounded-xl shadow-lg p-6 mb-8" >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tenders, companies, locations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="quantity-high">Quantity: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiFilter />
                </div>
              </div>

              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  value={selectedWasteType}
                  onChange={(e) => setSelectedWasteType(e.target.value)}
                >
                  {wasteTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mt-6 flex space-x-4 border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All Tenders
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'open' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('open')}
            >
              Open
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'closing' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('closing')}
            >
              Closing Soon
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'closed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('closed')}
            >
              Closed
            </button>
          </div>
        </div >

        {/* Tenders Grid */}
        {
          loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTenders.map((tender, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-gray-800">{tender.title}</h3>
                          {getStatusBadge(tender.status)}
                        </div>
                        <p className="text-gray-600 mt-1">{tender.company}</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {tender.wasteType}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-semibold">{tender.quantity} tons</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price/Ton</p>
                        <p className="font-semibold text-green-600">₹{tender.pricePerTon}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <div className="flex items-center">
                          <FiMapPin className="text-gray-400 mr-1" />
                          <span className="font-medium">{tender.location}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deadline</p>
                        <div className="flex items-center">
                          <FiClock className="text-gray-400 mr-1" />
                          <span className="font-medium">{getDaysLeft(tender.deadline)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-2">Requirements:</p>
                      <ul className="space-y-1 text-sm">
                        {tender.requirements.split(', ').map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <FiCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Order Range</p>
                        <p className="text-sm font-medium">{tender.minOrder} - {tender.maxOrder} tons</p>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium flex items-center ${tender.status === 'closed'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 transition-colors duration-300'
                          }`}
                        disabled={tender.status === 'closed'}
                      >
                        <FiShoppingCart className="mr-2" />
                        {tender.status === 'closed' ? 'Closed' : 'Submit Bid'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }

        {
          !loading && filteredTenders.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                <FiX className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No matching tenders found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <button
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedWasteType('All');
                  setActiveTab('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )
        }

        {/* How It Works Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How the Marketplace Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Find Tenders</h3>
              <p className="text-gray-600">
                Browse industrial tenders looking for agricultural waste materials
              </p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Submit Bid</h3>
              <p className="text-gray-600">
                Place competitive bids for your available agricultural waste
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Complete Transaction</h3>
              <p className="text-gray-600">
                Finalize deal, arrange logistics, and get paid upon delivery
              </p>
            </div>
          </div>
        </div>
      </main >

      {/* Footer */}
      < footer className="bg-green-900 text-white mt-16" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <svg className="h-8 w-8 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="ml-2 text-xl font-bold">AgriLink</span>
              </div>
              <p className="mt-4 text-green-200">
                Connecting farmers with industries to transform agricultural waste into valuable resources.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <p className="text-green-200 mb-4">
                Subscribe to get the latest tenders and market updates
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-800"
                />
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-green-800 text-center text-green-300">
            <p>© 2023 AgriLink. All rights reserved.</p>
          </div>
        </div>
      </footer >
    </div >
  );
}