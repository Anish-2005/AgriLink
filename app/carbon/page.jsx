'use client';
import { useState, useEffect } from 'react';
import { FiCloud, FiTarget, FiCreditCard, FiActivity, FiRefreshCw, FiZap, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getWasteListingsByUser } from '../actions/mongodbfunctions';
import { useUser } from '@civic/auth/react';

export default function CO2WalletPage() {
  const { user } = useUser();
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getWasteListingsByUser(user.id).then((wasteListings) => {
      // Calculate total CO2 saved (sum of all listings' quantity in tons)
      // FIX: include all listings, not just completed
      const totalCO2 = wasteListings.reduce((sum, item) => {
        // Convert to kg if needed
        const qty = parseFloat(item.quantity) || 0;
        const unit = item.quantityUnit || 'kg';
        return sum + (unit === 'ton' ? qty * 1000 : qty);
      }, 0);
      const totalTokens = Math.round(totalCO2 / 1000); // 1 token per ton
      // Transactions: map each listing to a transaction
      const txs = wasteListings.map((item, idx) => ({
        id: item._id.toString(),
        type: 'waste_sale',
        action: item.cropType ? `Sold ${item.cropType}` : 'Sold Waste',
        co2: (item.quantityUnit === 'ton' ? parseFloat(item.quantity) * 1000 : parseFloat(item.quantity)) || 0,
        tokens: ((item.quantityUnit === 'ton' ? parseFloat(item.quantity) * 1000 : parseFloat(item.quantity)) / 1000).toFixed(2),
        date: item.createdAt || new Date().toISOString(),
        status: item.status
      }));
      // Wallet summary
      setWalletData({
        totalCO2,
        totalTokens,
        equivalent: `${(totalCO2 / 1000).toFixed(2)} tons`,
        impact: `Equivalent to ${Math.round(totalCO2 / 25)} trees planted`,
        level: totalTokens > 10 ? 'Eco Champion' : 'Green Starter',
        progress: Math.min(100, Math.round((totalTokens / 20) * 100)),
        nextLevel: totalTokens > 10 ? 'Earth Guardian' : 'Eco Champion',
        nextLevelTokens: totalTokens > 10 ? 20 - totalTokens : 10 - totalTokens,
        lastMonthCO2: 0, // You can add logic for last month if needed
        lastMonthTokens: 0
      });
      setTransactions(txs);
      setLoading(false);
    });
  }, [user?.id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'waste_sale':
        return <FiActivity className="text-green-500" />;
      case 'energy_saving':
        return <FiZap className="text-yellow-500" />;
      case 'recycling':
        return <FiRefreshCw className="text-blue-500" />;
      case 'transport':
        return <FiBarChart2 className="text-purple-500" />;
      case 'renewable':
        return <FiCloud className="text-teal-500" />;
      default:
        return <FiTarget className="text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-teal-200 opacity-20 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-emerald-200 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-green-200 opacity-20 animate-bounce"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Carbon Credit Wallet
              </h1>
              <p className="text-xl text-teal-100 max-w-2xl">
                Track and manage your CO2 credits earned through sustainable farming practices. 
                <span className="block mt-2 text-lg font-medium">1 ton of CO2 saved = 1 Carbon Token</span>
              </p>

              {!loading && walletData && (
                <div className="grid grid-cols-2 gap-4 pt-4 max-w-md">
                  <div className="bg-teal-600 p-4 rounded-xl">
                    <div className="flex items-center">
                      <FiTarget className="text-2xl mr-2" />
                      <span className="text-sm">CO2 Saved</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{walletData.totalCO2} kg</p>
                    <p className="text-xs opacity-80 mt-1">{walletData.equivalent}</p>
                  </div>

                  <div className="bg-emerald-600 p-4 rounded-xl">
                    <div className="flex items-center">
                      <FiCreditCard className="text-2xl mr-2" />
                      <span className="text-sm">Carbon Tokens</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{walletData.totalTokens}</p>
                    <p className="text-xs opacity-80 mt-1">Verified credits</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-teal-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-teal-300 border-opacity-30 shadow-xl">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-teal-600 rounded-full p-4 mb-4">
                      <FiTarget className="text-white text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Your Impact</h3>
                    <p className="text-teal-200 mb-6">{walletData?.impact}</p>

                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Level: {walletData?.level}</span>
                        <span>Progress: {walletData?.progress}%</span>
                      </div>
                      <div className="w-full bg-teal-900 rounded-full h-4">
                        <motion.div
                          className="bg-teal-500 h-4 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${walletData?.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                      <div className="text-right text-xs mt-1">
                        Next: {walletData?.nextLevel} at {walletData?.nextLevelTokens} more tokens
                      </div>
                    </div>

                    <div className="bg-teal-800 rounded-lg p-4">
                      <p className="text-sm">Last month you saved</p>
                      <p className="text-xl font-bold">{walletData?.lastMonthCO2} kg CO2</p>
                      <p className="text-sm font-medium mt-1">+{walletData?.lastMonthTokens} tokens earned</p>
                      <p className="text-xs opacity-80 mt-1">Keep up the great work!</p>
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
        {!loading && walletData && (
          <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
            <div className="bg-teal-600 text-white p-4 rounded-xl">
              <div className="flex items-center">
                <FiTarget className="text-xl mr-2" />
                <span className="text-sm">CO2 Saved</span>
              </div>
              <p className="text-xl font-bold mt-2">{walletData.totalCO2} kg</p>
            </div>

            <div className="bg-emerald-600 text-white p-4 rounded-xl">
              <div className="flex items-center">
                <FiCreditCard className="text-xl mr-2" />
                <span className="text-sm">Carbon Tokens</span>
              </div>
              <p className="text-xl font-bold mt-2">{walletData.totalTokens}</p>
            </div>

            <div className="bg-teal-700 text-white p-4 rounded-xl col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span>Current Level: {walletData.level}</span>
                <span>Progress: {walletData.progress}%</span>
              </div>
              <div className="w-full bg-teal-900 rounded-full h-3">
                <motion.div
                  className="bg-teal-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${walletData.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Token Calculation Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Carbon Token System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-teal-600 text-3xl mb-4">1:1</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Simple Ratio</h3>
              <p className="text-gray-600">
                Every 1 ton (1000 kg) of CO2 saved equals 1 Carbon Token
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-teal-600 text-3xl mb-4">✓</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Verified Credits</h3>
              <p className="text-gray-600">
                All CO2 savings are verified and converted to tradeable carbon tokens
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-teal-600 text-3xl mb-4">🌱</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Real Impact</h3>
              <p className="text-gray-600">
                Your tokens represent genuine environmental impact and carbon reduction
              </p>
            </div>
          </div>
        </div>

        {/* CO2 Saving Actions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-teal-50 border-b border-teal-100">
            <h2 className="text-xl font-bold text-gray-800">CO2 Saving Actions</h2>
            <p className="text-gray-600 mt-1">Track your sustainable actions and carbon token earnings</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    CO2 Saved (kg)
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Carbon Tokens
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-teal-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                            {getActionIcon(tx.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{tx.action}</div>
                            <div className="text-sm text-gray-500 capitalize">{tx.type.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-teal-600">
                        {tx.co2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-bold">
                        +{tx.tokens}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {tx.status === 'completed'
                          ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                          : <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                          <FiTarget className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No CO2 actions yet</h3>
                        <p className="mt-1 text-gray-500">Your sustainable actions will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CO2 Impact Visualization */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Environmental Impact</h2>
            <div className="text-sm text-gray-500">Last 6 months</div>
          </div>

          <div className="h-64 flex items-end justify-center space-x-2 pb-6">
            {[0.65, 0.8, 1.2, 1.8, 2.1, 2.4].map((tokens, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center w-12"
                initial={{ height: 0 }}
                animate={{ height: `${tokens * 80}px` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <div
                  className="w-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-lg relative"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    {tokens}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Equivalent Trees Planted</p>
              <p className="text-lg font-bold">500+</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Cars Off the Road</p>
              <p className="text-lg font-bold">8</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Household Energy</p>
              <p className="text-lg font-bold">12 months</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Water Saved</p>
              <p className="text-lg font-bold">120,000 L</p>
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
                Building a sustainable future through agricultural innovation and verified carbon credits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">Carbon Calculator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Token Trading</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">CO2 Impact Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Token System</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Farming Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
              <p className="text-green-200 mb-4">
                Have questions about your CO2 credits? Contact our sustainability team.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Get Help
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-green-800 text-center text-green-300">
            <p>© 2023 AgriLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}