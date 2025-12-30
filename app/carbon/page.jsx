'use client';
import { useState, useEffect, useRef } from 'react';
import { FiCloud, FiTarget, FiCreditCard, FiActivity, FiRefreshCw, FiZap, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getWasteListingsByUser } from '../actions/mongodbfunctions';
import { useUser } from '@civic/auth/react';
import { ArrowRight, Leaf, Zap, Star, TrendingUp, Users, Globe, CheckCircle, Shield, Tree, Cloud, Droplets, Wind } from 'lucide-react';
import * as THREE from 'three';

export default function CO2WalletPage() {
  const { user } = useUser();
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getWasteListingsByUser(user.id).then((wasteListings) => {
      // Calculate total CO2 saved
      const totalCO2 = wasteListings.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const unit = item.quantityUnit || 'kg';
        return sum + (unit === 'ton' ? qty * 1000 : qty);
      }, 0);
      
      const totalTokens = Math.round(totalCO2 / 1000);
      const txs = wasteListings.map((item, idx) => ({
        id: item._id.toString(),
        type: 'waste_sale',
        action: item.cropType ? `Sold ${item.cropType}` : 'Sold Waste',
        co2: (item.quantityUnit === 'ton' ? parseFloat(item.quantity) * 1000 : parseFloat(item.quantity)) || 0,
        tokens: ((item.quantityUnit === 'ton' ? parseFloat(item.quantity) * 1000 : parseFloat(item.quantity)) / 1000).toFixed(2),
        date: item.createdAt || new Date().toISOString(),
        status: item.status
      }));

      const equivalentTrees = Math.round(totalCO2 / 25);
      const carsOffRoad = Math.round(totalCO2 / 4600);
      const householdEnergy = Math.round(totalCO2 / 8700);
      
      setWalletData({
        totalCO2,
        totalTokens,
        equivalent: `${(totalCO2 / 1000).toFixed(2)} tons`,
        impact: `Equivalent to planting ${equivalentTrees} trees`,
        level: totalTokens > 10 ? 'Eco Champion' : totalTokens > 5 ? 'Green Warrior' : 'Green Starter',
        progress: Math.min(100, Math.round((totalTokens / 20) * 100)),
        nextLevel: totalTokens > 10 ? 'Earth Guardian' : totalTokens > 5 ? 'Eco Champion' : 'Green Warrior',
        nextLevelTokens: totalTokens > 10 ? 20 - totalTokens : totalTokens > 5 ? 10 - totalTokens : 5 - totalTokens,
        lastMonthCO2: 0,
        lastMonthTokens: 0,
        equivalentTrees,
        carsOffRoad,
        householdEnergy,
        waterSaved: Math.round(totalCO2 * 1.2)
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
        return <FiActivity className="text-emerald-600" />;
      case 'energy_saving':
        return <FiZap className="text-amber-600" />;
      case 'recycling':
        return <FiRefreshCw className="text-blue-600" />;
      case 'transport':
        return <FiBarChart2 className="text-violet-600" />;
      case 'renewable':
        return <FiCloud className="text-teal-600" />;
      default:
        return <FiTarget className="text-emerald-600" />;
    }
  };

  const impactMetrics = [
    { icon: Tree, label: 'Trees Planted', value: walletData?.equivalentTrees || 0, color: 'from-emerald-500 to-lime-500' },
    { icon: Cloud, label: 'Cars Off Road', value: walletData?.carsOffRoad || 0, color: 'from-blue-500 to-indigo-500' },
    { icon: Wind, label: 'Household Energy', value: `${walletData?.householdEnergy || 0} months`, color: 'from-violet-500 to-purple-500' },
    { icon: Droplets, label: 'Water Saved', value: `${(walletData?.waterSaved || 0).toLocaleString()} L`, color: 'from-teal-500 to-cyan-500' }
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
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-teal-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-base font-extrabold text-emerald-700">Carbon Credit Wallet</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
                Your Sustainable
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                  Impact Portfolio
                </span>
              </h1>

              <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
                Track and manage your verified CO₂ credits earned through sustainable farming practices. 
                <span className="block mt-2 text-lg font-extrabold text-emerald-700">1 ton CO₂ saved = 1 Carbon Token</span>
              </p>

              {!loading && walletData && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-lime-400 text-white rounded-2xl p-6 shadow-lg border-2 border-emerald-600">
                    <div className="flex items-center space-x-3">
                      <FiTarget className="h-6 w-6" />
                      <div>
                        <p className="text-sm font-bold opacity-90">CO₂ Saved</p>
                        <p className="text-2xl font-extrabold">{walletData.totalCO2.toLocaleString()} kg</p>
                        <p className="text-xs opacity-80 mt-1">{walletData.equivalent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-500 to-emerald-400 text-white rounded-2xl p-6 shadow-lg border-2 border-emerald-600">
                    <div className="flex items-center space-x-3">
                      <FiCreditCard className="h-6 w-6" />
                      <div>
                        <p className="text-sm font-bold opacity-90">Carbon Tokens</p>
                        <p className="text-2xl font-extrabold">{walletData.totalTokens}</p>
                        <p className="text-xs opacity-80 mt-1">Verified Credits</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Impact Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-3 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 font-bold uppercase tracking-wide">Your Impact Level</p>
                    <p className="text-2xl font-extrabold text-emerald-800">{walletData?.level}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-extrabold text-emerald-800">Progress</span>
                    <span className="font-extrabold text-emerald-800">{walletData?.progress}%</span>
                  </div>
                  <div className="w-full bg-emerald-100 border-2 border-emerald-300 rounded-full h-4">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${walletData?.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-right text-sm mt-2 text-emerald-700 font-semibold">
                    Next: {walletData?.nextLevel} ({walletData?.nextLevelTokens > 0 ? `+${walletData.nextLevelTokens}` : walletData?.nextLevelTokens} tokens)
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-sm text-emerald-800 font-bold mb-2">🌱 Your Environmental Impact</p>
                  <p className="text-emerald-900 font-semibold">{walletData?.impact}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-extrabold text-emerald-800">{walletData?.lastMonthCO2 || 0}</div>
                      <div className="text-xs text-emerald-700">Last month CO₂</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-extrabold text-emerald-800">+{walletData?.lastMonthTokens || 0}</div>
                      <div className="text-xs text-emerald-700">Tokens earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-500 border-y-4 border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, idx) => (
              <div key={idx} className="text-center text-white group cursor-pointer" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <metric.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold drop-shadow-lg mb-2">{metric.value}</div>
                <div className="text-sm font-bold uppercase tracking-wide opacity-90">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Token System Info */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-2 border-emerald-500">
          <h2 className="text-3xl font-extrabold text-emerald-800 mb-8 text-center drop-shadow-lg">
            Carbon Token System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '1:1', 
                title: 'Simple Ratio', 
                desc: 'Every 1 ton (1000 kg) of CO₂ saved equals 1 Carbon Token',
                color: 'from-emerald-500 to-teal-500'
              },
              { 
                icon: '✓', 
                title: 'Verified Credits', 
                desc: 'All CO₂ savings are independently verified and converted to tradeable carbon tokens',
                color: 'from-blue-500 to-indigo-500'
              },
              { 
                icon: '🌍', 
                title: 'Real Impact', 
                desc: 'Your tokens represent genuine environmental impact and sustainable farming practices',
                color: 'from-violet-500 to-purple-500'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={idx * 200}>
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} mb-6`}>
                  <span className="text-3xl font-extrabold text-white">{item.icon}</span>
                </div>
                <h3 className="text-xl font-extrabold text-emerald-800 mb-3">{item.title}</h3>
                <p className="text-emerald-900 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CO₂ Transactions */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-emerald-800 drop-shadow-lg">CO₂ Saving Actions</h2>
              <p className="text-emerald-900 font-semibold mt-2">Track your sustainable actions and carbon token earnings</p>
            </div>
            <div className="text-sm text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-xl border-2 border-emerald-300">
              Total: {transactions.length} Actions
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="divide-y divide-emerald-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-6 hover:bg-emerald-50 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300 rounded-xl p-3">
                          {getActionIcon(tx.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-extrabold text-emerald-800">{tx.action}</h4>
                          <p className="text-emerald-700 font-semibold capitalize">{tx.type.replace('_', ' ')}</p>
                          <p className="text-sm text-emerald-600 mt-1">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-700">CO₂ Saved</p>
                          <p className="text-xl font-extrabold text-emerald-800">{tx.co2} kg</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-700">Tokens Earned</p>
                          <p className="text-xl font-extrabold text-green-600">+{tx.tokens}</p>
                        </div>
                        
                        <div>
                          {tx.status === 'completed' ? (
                            <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-sm font-extrabold rounded-full shadow-md">
                              Verified
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-extrabold rounded-full shadow-md">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 mb-6">
                  <FiTarget className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">No CO₂ actions yet</h3>
                <p className="text-emerald-700 font-semibold mb-8">Your sustainable actions will appear here once you start selling waste</p>
                <button className="group relative px-8 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-500">
                  <span className="flex items-center space-x-2">
                    <span>Start Selling Waste</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Impact Visualization */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-emerald-800 drop-shadow-lg">Environmental Impact Progress</h2>
            <div className="text-sm text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-xl border-2 border-emerald-300">
              Last 6 Months
            </div>
          </div>

          <div className="h-64 flex items-end justify-center space-x-4 pb-8">
            {[0.8, 1.2, 1.8, 2.1, 2.4, 3.2].map((tokens, index) => (
              <div key={index} className="relative flex flex-col items-center w-16" data-aos="fade-up" data-aos-delay={index * 100}>
                <motion.div
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-2xl relative"
                  initial={{ height: 0 }}
                  animate={{ height: `${tokens * 60}px` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-extrabold text-emerald-800">
                    {tokens}
                  </div>
                </motion.div>
                <div className="mt-3 text-sm font-bold text-emerald-700">
                  {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Verified by', value: 'UN SDG Standards', color: 'from-emerald-500 to-teal-500' },
              { label: 'Carbon Audit', value: 'Quarterly Reports', color: 'from-blue-500 to-indigo-500' },
              { label: 'Token Liquidity', value: '₹850/Ton Market', color: 'from-violet-500 to-purple-500' },
              { label: 'Farmer Satisfaction', value: '98% Positive', color: 'from-amber-500 to-orange-500' }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 rounded-2xl p-6">
                <p className="text-sm font-bold text-emerald-700 mb-2">{item.label}</p>
                <p className="text-xl font-extrabold text-emerald-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50 border-y-4 border-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-6">
            Ready to Grow Your Carbon Portfolio?
          </h2>
          <p className="text-xl text-emerald-900 mb-10 font-semibold">
            Join thousands of farmers already earning premium prices and carbon credits for their waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
              <span className="flex items-center justify-center space-x-2">
                <span>Sell Waste & Earn Tokens</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
              View Token Marketplace
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
                <span className="text-2xl font-extrabold text-emerald-800">AgriLink Carbon</span>
              </div>
              <p className="text-emerald-700 leading-relaxed max-w-md font-semibold">
                Building a sustainable future through verified carbon credits and agricultural innovation.
                98% farmer satisfaction with transparent tracking.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-800 font-extrabold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-emerald-500 transition-colors font-bold">Carbon Calculator</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors font-bold">Token Marketplace</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors font-bold">Sustainability Tips</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors font-bold">Impact Reports</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-800 font-extrabold mb-4">Carbon Support</h3>
              <ul className="space-y-3 font-semibold">
                <li>carbon@agrilink.com</li>
                <li>+91 98765 43211</li>
                <li>24/7 Carbon Support</li>
                <li>Verified by UN SDG</li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-emerald-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-700 text-sm font-semibold">© 2025 AgriLink Carbon. All rights reserved. Verified by UN Sustainable Development Goals.</p>
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
      `}</style>
    </div>
  );
}