 'use client';
 import { useState, useEffect, useRef } from 'react';
 import { FiCloud, FiActivity, FiRefreshCw, FiZap, FiBarChart2 } from 'react-icons/fi';
 import Navbar from '../components/Navbar';
 import { getWasteListingsByUser } from '../actions/mongodbfunctions';
 import { useUser } from '@civic/auth/react';
 import { ArrowRight, Leaf, Zap, Star, TrendingUp, Users, Globe, CheckCircle, Shield, Cloud, Droplets, Wind } from 'lucide-react';
 import * as THREE from 'three';
 import Footer from '../components/Footer';

import Hero from './components/Hero';
import ImpactCard from './components/ImpactCard';
import ImpactStats from './components/ImpactStats';
import TokenInfo from './components/TokenInfo';
import Transactions from './components/Transactions';
import ImpactVisualization from './components/ImpactVisualization';
import CTA from './components/CTA';

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
    { icon: Leaf, label: 'Trees Planted', value: walletData?.equivalentTrees || 0, color: 'from-emerald-500 to-lime-500' },
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
            <Hero walletData={walletData} loading={loading} user={user} />
            <ImpactCard walletData={walletData} />
          </div>
        </div>
      </section>

      <ImpactStats impactMetrics={impactMetrics} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TokenInfo />

        <Transactions loading={loading} transactions={transactions} formatDate={formatDate} getActionIcon={getActionIcon} />

        <ImpactVisualization />
      </main>

      <CTA />

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
      `}</style>
    </div>
  );
}