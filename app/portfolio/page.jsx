'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@civic/auth/react';
import { FiFilter, FiSearch, FiDollarSign, FiTrendingUp, FiCalendar, FiPackage, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getWasteListingsByUser } from '../actions/mongodbfunctions';
import Navbar from '../components/Navbar';
import Image from 'next/image';

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

  // Fetch sales data for the logged-in user
  const fetchUserSales = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch waste listings for the logged-in user
      const sales = await getWasteListingsByUser(user.id);

      // Transform data to match the portfolio display format
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

      // Calculate stats
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
      setStats({
        totalSales: 0,
        totalWeight: 0,
        averagePrice: 0,
        transactions: 0,
      });
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

    // Apply search filter
    if (searchTerm) {
      results = results.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.wasteDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      results = results.filter(item => item.status === activeFilter);
    }

    // Apply sorting
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

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1 inline" /> : <FiChevronDown className="ml-1 inline" />;
  };

  const getStatusBadge = (status) => {
    return status === 'completed'
      ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
      : <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your portfolio.
          </p>
          <a
            href="/login"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Head>
        <title>AgriLink | Portfolio</title>
      </Head>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-green-200 opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-yellow-200 opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-orange-200 opacity-20 animate-blob"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Waste Listings
              </h1>
              <p className="text-xl text-green-100 max-w-2xl">
                Track all your agricultural waste listings, earnings, and transaction history in one place.
              </p>
              <div className="flex space-x-4 pt-4">
                <button className="bg-white text-green-800 hover:bg-green-100 font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Download Report
                </button>
                <button
                  onClick={refreshData}
                  className="flex items-center border-2 border-white text-white hover:bg-green-700 font-medium px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-yellow-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-green-300 border-opacity-30 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-green-600 p-4 rounded-xl">
                      <FiDollarSign className="text-white text-2xl mb-2" />
                      <p className="text-sm text-green-200">Total Earnings</p>
                      <p className="text-2xl font-bold">{formatCurrency(filteredData.filter(item => item.status === 'completed').reduce((sum, item) => sum + (item.price * item.weight), 0))}</p>
                    </div>
                    <div className="bg-green-700 p-4 rounded-xl">
                      <FiTrendingUp className="text-white text-2xl mb-2" />
                      <p className="text-sm text-green-200">Avg. Price/{filteredData[0]?.quantityUnit || 'kg'}</p>
                      <p className="text-2xl font-bold">₹{(() => {
                        const completed = filteredData.filter(item => item.status === 'completed');
                        const totalSales = completed.reduce((sum, item) => sum + (item.price * item.weight), 0);
                        const totalWeight = completed.reduce((sum, item) => sum + item.weight, 0);
                        return Math.round(totalWeight > 0 ? totalSales / totalWeight : 0);
                      })()}</p>
                    </div>
                    <div className="bg-green-800 p-4 rounded-xl">
                      <FiPackage className="text-white text-2xl mb-2" />
                      <p className="text-sm text-green-200">Total Listed</p>
                      <p className="text-2xl font-bold">{filteredData.filter(item => item.status === 'completed').reduce((sum, item) => sum + item.weight, 0)} {filteredData[0]?.quantityUnit || 'kg'}</p>
                    </div>
                    <div className="bg-green-900 p-4 rounded-xl">
                      <FiCalendar className="text-white text-2xl mb-2" />
                      <p className="text-sm text-green-200">Listings</p>
                      <p className="text-2xl font-bold">{filteredData.filter(item => item.status === 'completed').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards - Mobile View */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-600 text-white p-4 rounded-xl">
            <FiDollarSign className="text-2xl mb-2" />
            <p className="text-sm">Total Earnings</p>
            <p className="text-lg font-bold">{formatCurrency(filteredData.filter(item => item.status === 'completed').reduce((sum, item) => sum + (item.price * item.weight), 0))}</p>
          </div>
          <div className="bg-green-700 text-white p-4 rounded-xl">
            <FiTrendingUp className="text-2xl mb-2" />
            <p className="text-sm">Avg. Price/{filteredData[0]?.quantityUnit || 'kg'}</p>
            <p className="text-lg font-bold">₹{(() => {
              const completed = filteredData.filter(item => item.status === 'completed');
              const totalSales = completed.reduce((sum, item) => sum + (item.price * item.weight), 0);
              const totalWeight = completed.reduce((sum, item) => sum + item.weight, 0);
              return Math.round(totalWeight > 0 ? totalSales / totalWeight : 0);
            })()}</p>
          </div>
          <div className="bg-green-800 text-white p-4 rounded-xl">
            <FiPackage className="text-2xl mb-2" />
            <p className="text-sm">Total Listed</p>
            <p className="text-lg font-bold">{filteredData.filter(item => item.status === 'completed').reduce((sum, item) => sum + item.weight, 0)} {filteredData[0]?.quantityUnit || 'kg'}</p>
          </div>
          <div className="bg-green-900 text-white p-4 rounded-xl">
            <FiCalendar className="text-2xl mb-2" />
            <p className="text-sm">Listings</p>
            <p className="text-lg font-bold">{filteredData.filter(item => item.status === 'completed').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items or descriptions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === 'pending'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('pending')}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('item')}
                  >
                    <div className="flex items-center">
                      Item
                      {getSortIndicator('item')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('price')}
                  >
                    <div className="flex items-center justify-end">
                      Price
                      {getSortIndicator('price')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('weight')}
                  >
                    <div className="flex items-center justify-end">
                      Quantity ({salesData[0]?.quantityUnit || 'kg'})
                      {getSortIndicator('weight')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('time')}
                  >
                    <div className="flex items-center justify-end">
                      Date
                      {getSortIndicator('time')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center justify-end">
                      Total
                      {getSortIndicator('id')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-green-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {sale.imageUrl ? (
                            <Image height={10} width={10}
                              src={sale.imageUrl}
                              alt={sale.item}
                              className="h-10 w-10 rounded-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-800 font-medium">{sale.item.charAt(0)}</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{sale.item}</div>
                            <div className="text-sm text-gray-500">{sale.wasteDescription}</div>
                            <div className="text-xs text-gray-400">ID: {sale.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                        ₹{sale.price}/{sale.quantityUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {sale.weight} {sale.quantityUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatDate(sale.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
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
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                          <FiPackage className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary */}
          {!loading && filteredData.length > 0 && (
            <div className="bg-green-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredData.length}</span> of{' '}
                  <span className="font-medium">{salesData.length}</span> listings
                </p>
                <div className="flex space-x-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Quantity</p>
                    <p className="font-medium">
                      {filteredData.reduce((sum, item) => sum + item.weight, 0)} {salesData[0]?.quantityUnit || 'kg'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(
                        filteredData.reduce((sum, item) => sum + (item.price * item.weight), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Listings Chart Placeholder */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Listing Performance</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">Monthly</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Quarterly</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Yearly</button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-center space-x-4 pb-6">
            {/* Simple bar chart animation */}
            {[40, 70, 100, 80, 120, 90, 60].map((height, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div
                  className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-1000 ease-out"
                  style={{ height: `${height}px` }}
                />
                <div className="mt-2 text-xs text-gray-500">{['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Highest Listing</p>
              <p className="text-lg font-bold">₹28,500</p>
              <p className="text-xs text-gray-500">Rice Straw</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Avg. Price/{salesData[0]?.quantityUnit || 'kg'}</p>
              <p className="text-lg font-bold">₹{Math.round(stats.averagePrice)}</p>
              <p className="text-xs text-gray-500">Based on completed listings</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Top Item</p>
              <p className="text-lg font-bold">{salesData[0]?.item || 'Rice Straw'}</p>
              <p className="text-xs text-gray-500">{stats.totalWeight} {salesData[0]?.quantityUnit || 'kg'} listed</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Recent Listing</p>
              <p className="text-lg font-bold">{formatCurrency(salesData[0]?.price * salesData[0]?.weight || 0)}</p>
              <p className="text-xs text-gray-500">{salesData[0]?.item || 'Wheat Straw'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white mt-16">
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
                Transforming agricultural waste into valuable resources through technology.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reports</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Farmers Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Insights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-green-200 mb-4">
                Have questions about your portfolio? We're here to help.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Get Support
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-green-800 text-center text-green-200">
            <p>© 2025 AgriLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}