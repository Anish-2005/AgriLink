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
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import Filters from './components/Filters';
import ListingsTable from './components/ListingsTable';
import PerformanceChart from './components/PerformanceChart';
import PortfolioCTA from './components/PortfolioCTA';
import ReportPreview from './components/ReportPreview';

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
  const wrapperRef = useRef(null);
  const reportRef = useRef(null);
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

  const handleDownloadReport = async () => {
    try {
      const html2canvasMod = await import('html2canvas');
      const jspdfMod = await import('jspdf');
      const html2canvas = html2canvasMod.default || html2canvasMod;
      const jsPDFConstructor = jspdfMod.jsPDF || jspdfMod.default || jspdfMod;

      const element = reportRef.current || wrapperRef.current || document.body;
      // Ensure the report element is visible to html2canvas (we render it off-screen but visible)
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDFConstructor('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgProps = pdf.getImageProperties ? pdf.getImageProperties(imgData) : { width: canvas.width, height: canvas.height };
      const imgWidthMm = pdfWidth - margin * 2;
      const imgHeightMm = (imgProps.height * imgWidthMm) / imgProps.width;

      if (imgHeightMm < pdfHeight - margin * 2) {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidthMm, imgHeightMm);
      } else {
        // Split into pages
        const pageHeightPx = Math.floor((imgProps.width * (pdfHeight - margin * 2)) / imgWidthMm);
        const canvasHeight = canvas.height;
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');

        let y = 0;
        let first = true;
        while (y < canvasHeight) {
          const h = Math.min(pageHeightPx, canvasHeight - y);
          pageCanvas.width = canvas.width;
          pageCanvas.height = h;
          pageCtx.fillStyle = '#fff';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          pageCtx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, pageCanvas.width, pageCanvas.height);
          const pageData = pageCanvas.toDataURL('image/png');
          if (!first) pdf.addPage();
          pdf.addImage(pageData, 'PNG', margin, margin, imgWidthMm, (h * imgWidthMm) / canvas.width);
          y += h;
          first = false;
        }
      }

      pdf.save(`AgriLink-Portfolio-${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Failed to generate PDF. See console for details.');
    }
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
    <div ref={wrapperRef} className="min-h-screen bg-white relative overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas ref={threeCanvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0}} />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero handleDownloadReport={handleDownloadReport} refreshData={refreshData} loading={loading} portfolioStats={portfolioStats} />

      <StatsBanner displaySales={displaySales} displayStats={displayStats} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Search */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortConfig={sortConfig}
          requestSort={requestSort}
          displaySales={displaySales}
          displaySalesData={displaySalesData}
        />

        {/* Listings Table */}
        <ListingsTable
          displaySales={displaySales}
          displaySalesData={displaySalesData}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          requestSort={requestSort}
          sortConfig={sortConfig}
        />

        <PerformanceChart displayStats={displayStats} displaySalesData={displaySalesData} />
      </main>
      <PortfolioCTA />

      {/* Footer */}
      <Footer />

      {/* Off-screen report used for PDF generation */}
      <ReportPreview
        reportRef={reportRef}
        displaySales={displaySales}
        displaySalesData={displaySalesData}
        displayStats={displayStats}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        user={user}
      />

      {/* Scroll button removed — use global ScrollToTopButton in layout */}

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