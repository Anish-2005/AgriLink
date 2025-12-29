'use client'
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { Leaf, Camera, DollarSign, Users, Shield, TrendingUp, CheckCircle, ArrowRight, Menu, X, Star, Zap, BarChart3, Globe } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [signinBtnLoading, setSigninBtnLoading] = useState(false);
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
    // Add subtle animated pattern (faint, spaced dots)
    const dots = [];
    const dotCount = 24;
    for (let i = 0; i < dotCount; i++) {
      const geometry = new THREE.SphereGeometry(0.045, 12, 12);
      const material = new THREE.MeshBasicMaterial({ color: 0x7ed957, transparent: true, opacity: 0.18 }); // soft green, faint
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.sin((i / dotCount) * Math.PI * 2) * 3.5;
      mesh.position.y = Math.cos((i / dotCount) * Math.PI * 2) * 2.2;
      mesh.position.z = Math.random() * 0.8 - 0.4;
      scene.add(mesh);
      dots.push(mesh);
    }
    // Animate (very slow, subtle)
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

  const features = [
    {
      icon: Camera,
      title: 'AI Waste Recognition',
      description: 'Simply snap a photo - our AI instantly identifies waste type and quality with 95% accuracy.',
      color: 'from-lime-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-lime-50 to-emerald-50'
    },
    {
      icon: DollarSign,
      title: 'Smart Pricing',
      description: 'Real-time market valuation based on demand, quality and location factors.',
      color: 'from-amber-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    {
      icon: Users,
      title: 'Industry Network',
      description: 'Direct access to 500+ verified buyers across biomass, packaging, and biofuel sectors.',
      color: 'from-blue-500 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      icon: Leaf,
      title: 'Eco Impact',
      description: 'Track your CO₂ reduction and sustainability contributions in real-time.',
      color: 'from-emerald-500 to-lime-500',
      gradient: 'bg-gradient-to-br from-emerald-50 to-lime-50'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Upload Waste Photo',
      description: 'Use our mobile app or website to photograph your agricultural waste. Our system accepts images of crop residue, husks, straw, and more.',
      tags: ['Mobile App', 'Web Upload'],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our advanced machine learning models analyze the image to classify waste type, estimate quantity, and assess quality within seconds.',
      tags: ['95% Accuracy', 'Instant Results'],
      color: 'from-amber-500 to-orange-500'
    },
    {
      number: 3,
      title: 'Receive Offers',
      description: 'Get multiple competitive offers from verified industrial buyers. Compare prices, buyer ratings, and pickup options.',
      tags: ['Verified Buyers Only'],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      number: 4,
      title: 'Complete Transaction',
      description: 'Finalize the deal, arrange logistics, and get paid directly to your bank account. Track your environmental impact in your dashboard.',
      tags: ['Secure Payments'],
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Rice Farmer, Punjab',
      quote: 'AgriLink has changed my life. I used to burn my rice straw, now I earn ₹15,000 per acre from selling it. The AI photo system is so easy to use!',
      gradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      name: 'Priya Sharma',
      role: 'Biomass Plant Manager',
      quote: 'We get consistent quality agricultural waste through AgriLink. The platform saves us 30% in procurement costs compared to traditional methods.',
      gradient: 'from-blue-500/10 to-indigo-500/10'
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Environmental Scientist',
      quote: 'AgriLink\'s model is revolutionary. For every 100 farmers using the platform, we prevent approximately 500 tons of CO₂ emissions annually.',
      gradient: 'from-violet-500/10 to-purple-500/10'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Farmers Empowered', icon: Users },
    { value: '500+', label: 'Industrial Partners', icon: Globe },
    { value: '₹25Cr+', label: 'Waste Monetized', icon: TrendingUp },
    { value: '100K+', label: 'CO₂ Tons Saved', icon: Leaf }
  ];

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
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-lime-400 to-emerald-400 p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className={`text-3xl font-extrabold text-emerald-700 tracking-tight drop-shadow-lg border-b-4 border-emerald-500 pb-1`}>
                AgriLink
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 ${isScrolled ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-800 hover:text-emerald-900'}`}> 
                Features
              </a>
              <a href="#how-it-works" className={`text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 ${isScrolled ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-800 hover:text-emerald-900'}`}> 
                How It Works
              </a>
              <a href="#testimonials" className={`text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 ${isScrolled ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-800 hover:text-emerald-900'}`}> 
                Testimonials
              </a>
              <button
                onClick={() => {
                  if (user) {
                    setUser(null);
                  } else {
                    setSigninBtnLoading(true);
                    setTimeout(() => {
                      setUser({ name: 'Demo User' });
                      setSigninBtnLoading(false);
                    }, 1000);
                  }
                }}
                className="relative group px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {signinBtnLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <span>{user ? 'Log out' : 'Get Started'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t-4 border-emerald-500">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-wide border-b-2 border-transparent hover:border-emerald-500">Features</a>
              <a href="#how-it-works" className="block text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-wide border-b-2 border-transparent hover:border-emerald-500">How It Works</a>
              <a href="#testimonials" className="block text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-wide border-b-2 border-transparent hover:border-emerald-500">Testimonials</a>
              <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg border-2 border-emerald-500">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span className="text-base font-extrabold text-emerald-700">AI-Powered Marketplace</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
                From Waste to
                <span className="block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                  Wealth
                </span>
              </h1>

              <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
                AgriLink's AI-powered platform transforms agricultural waste into valuable resources, creating income for farmers and sustainable materials for industries.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/app')}
                  className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {signinBtnLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <span>{user ? 'Start Selling Waste' : 'Be a member'}</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:border-emerald-700 hover:text-white hover:bg-emerald-600/90 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md">
                  <span>How It Works</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold shadow-md">
                      {['R', 'P', 'A', 'S'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-emerald-900 mt-1 font-extrabold">Trusted by 10,000+ farmers</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
              <img
                src="https://earth.org/wp-content/uploads/2022/03/Untitled-design-2022-03-18T144807.712.jpg"
                alt="Agricultural waste"
                className="relative rounded-3xl shadow-2xl w-full h-auto border-4 border-emerald-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border-2 border-emerald-500">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-900 font-extrabold">Monthly Revenue</p>
                    <p className="text-xl font-extrabold text-emerald-800">₹45,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-extrabold uppercase tracking-wide text-lg">Features</span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-emerald-800 drop-shadow-lg">
              Revolutionizing Agricultural Waste
            </h2>
            <p className="mt-4 text-xl text-emerald-900 max-w-2xl mx-auto drop-shadow-md font-semibold">
              Our platform combines cutting-edge technology with sustainable solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-500 shadow-xl hover:shadow-2xl cursor-pointer group`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform shadow-md border-2 border-emerald-500`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-emerald-800 mb-3 drop-shadow-md border-b-2 border-emerald-500 pb-1">{feature.title}</h3>
                <p className="text-emerald-900 leading-relaxed drop-shadow-sm font-semibold">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold uppercase tracking-wide text-sm">Process</span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-gray-900">
              Simple 4-Step Process
            </h2>
          </div>

          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-700 text-2xl font-extrabold mb-6 shadow-lg`}>{step.number}</div>
                  <h3 className="text-3xl font-extrabold text-emerald-800 mb-4 border-b-2 border-emerald-500 pb-1">{step.title}</h3>
                  <p className="text-lg text-emerald-900 leading-relaxed mb-6 font-semibold">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`relative p-8 bg-white border-2 border-emerald-500 rounded-3xl shadow-2xl`}>
                    <div className="absolute inset-0 bg-emerald-50/30 rounded-3xl backdrop-blur-sm"></div>
                    <div className="relative h-64 flex items-center justify-center">
                      {idx === 0 && (
                        <img
                          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                          alt="Upload Waste Photo"
                          className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                        />
                      )}
                      {idx === 1 && (
                        <img
                          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80"
                          alt="AI Analysis"
                          className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                        />
                      )}
                      {idx === 2 && (
                        <img
                          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
                          alt="Receive Offers"
                          className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                        />
                      )}
                      {idx === 3 && (
                        <img
                          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                          alt="Complete Transaction"
                          className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y-4 border-emerald-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <stat.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-2">{stat.value}</div>
                <div className="text-emerald-700 font-bold uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white border-t-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-extrabold uppercase tracking-wide text-lg">Testimonials</span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-emerald-800 drop-shadow-lg">
              Trusted by Farmers & Industries
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-3xl border-2 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Users className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-800">{testimonial.name}</h4>
                    <p className="text-sm text-emerald-700 font-semibold">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-emerald-900 italic leading-relaxed font-semibold">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-y-4 border-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl border-4 border-emerald-500"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl border-4 border-emerald-500"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-6 border-b-4 border-emerald-500 pb-2">
            Ready to transform your agricultural waste into profit?
          </h2>
          <p className="text-xl text-emerald-900 mb-10 font-semibold">
            Join thousands of farmers already benefiting from AgriLink's smart marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-emerald-500">
              <span className="flex items-center justify-center space-x-2">
                <span>Get Started - It's Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
              Request Demo
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
                <span className="text-2xl font-extrabold text-emerald-800">AgriLink</span>
              </div>
              <p className="text-emerald-700 leading-relaxed max-w-md font-semibold">
                Connecting farmers with industries to create sustainable value from agricultural waste.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-800 font-extrabold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-emerald-500 transition-colors font-bold">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-500 transition-colors font-bold">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-emerald-500 transition-colors font-bold">Testimonials</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors font-bold">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-800 font-extrabold mb-4">Contact</h3>
              <ul className="space-y-3 font-semibold">
                <li>contact@agrilink.com</li>
                <li>+91 98765 43210</li>
                <li>Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-emerald-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-700 text-sm font-semibold">© 2025 AgriLink. All rights reserved.</p>
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

      <style>{`
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