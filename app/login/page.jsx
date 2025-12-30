'use client';
import { useUser, UserButton } from '@civic/auth/react';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, Leaf, Zap, Star, Shield, CheckCircle, Users, Globe, Camera, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/Footer';

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

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 text-emerald-700 hover:text-emerald-900">
                Home
              </Link>
              <Link href="/app" className="text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 text-emerald-700 hover:text-emerald-900">
                Upload Waste
              </Link>
              <Link href="/marketplace" className="text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 text-emerald-700 hover:text-emerald-900">
                Marketplace
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0  h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
          <div className="absolute bottom-0 right-0  h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 place-items-center  lg:place-items-start gap-12">
<div className="space-y-8 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-base font-extrabold text-emerald-700">Secure Authentication</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
                Welcome to
                <span className=" py-2 block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                  AgriLink
                </span>
              </h1>

              <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
                Join thousands of farmers already transforming agricultural waste into valuable resources. 
                Securely authenticate to access premium features and start earning today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link
                      href="/app"
                      className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-105"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Go to Dashboard</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>

                    <button
                      onClick={() => signOut()}
                      className="px-8 py-4 border-2 border-red-500 text-red-600 rounded-xl font-extrabold hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="bg-gradient-to-r from-emerald-500 to-lime-400 p-2 rounded-xl">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-extrabold text-emerald-800">Civic Secure Login</span>
                      </div>
                      <div className="flex justify-center">
                        <UserButton />
                      </div>
                      <p className="text-sm text-emerald-700 text-center mt-4 font-semibold">
                        Secure, blockchain-powered authentication for farmers
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {user && (
                <div className="bg-gradient-to-br from-emerald-50 to-lime-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 flex items-center justify-center text-white font-extrabold border-2 border-emerald-600">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'F'}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-emerald-800">
                        Welcome, {user?.name || user?.email?.split('@')[0] || 'Farmer'}!
                      </h3>
                      <p className="text-emerald-700 font-semibold">
                        Premium Member • Verified Account
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

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
      `}</style>
    </div>
  );
}