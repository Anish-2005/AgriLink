"use client";
import { useUser } from '@civic/auth/react';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, Leaf, Shield, Users, Globe, Camera, DollarSign } from 'lucide-react';
import Footer from '../components/Footer';
import LoginNav from './components/LoginNav';
import LoginHero from './components/LoginHero';
import FeaturesGrid from './components/FeaturesGrid';
import StatsGrid from './components/StatsGrid';

export default function LoginPage() {
  const { user, isLoading, error, signOut } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const threeCanvasRef = useRef(null);
  
  // Three.js animated background setup
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
    if (!isLoading && !error) {
      console.log(user);
    }
  }, [user, isLoading, error]);

  const features = [
    {
      icon: Camera,
      title: 'AI Waste Recognition',
      description: 'Simply snap a photo - our AI instantly identifies waste type and quality.',
      color: 'from-lime-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: 'Smart Pricing',
      description: 'Real-time market valuation based on demand, quality and location.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Industry Network',
      description: 'Direct access to 500+ verified buyers across multiple sectors.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Leaf,
      title: 'Eco Impact',
      description: 'Track your CO₂ reduction and sustainability contributions.',
      color: 'from-emerald-500 to-lime-500'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Farmers Empowered', icon: Users },
    { value: '500+', label: 'Industrial Partners', icon: Globe },
    { value: '₹25Cr+', label: 'Waste Monetized', icon: DollarSign },
    { value: '100K+', label: 'CO₂ Tons Saved', icon: Leaf }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-extrabold text-emerald-800 mb-2">Error Loading</h2>
          <p className="text-emerald-700 mb-4">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-extrabold hover:bg-emerald-700 transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas ref={threeCanvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0}} />

      <LoginNav isScrolled={isScrolled} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0  h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
          <div className="absolute bottom-0 right-0  h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginHero user={user} isLoading={isLoading} signOut={signOut} />

          <FeaturesGrid features={features} />
          <StatsGrid stats={stats} />
        </div>
      </section>



      {/* Footer */}
      <Footer />

      {/* Scroll button removed (global ScrollToTopButton is used in layout) */}

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