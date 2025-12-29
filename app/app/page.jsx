'use client'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { FiUpload, FiCamera, FiInfo, FiCheckCircle, FiXCircle, FiEdit2 } from 'react-icons/fi';
import { uploadWasteInfo } from "../actions/mongodbfunctions";
import { useUser } from '@civic/auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Camera, Leaf, TrendingUp, Users, Shield, Zap, Star, CheckCircle } from 'lucide-react';
import * as THREE from 'three';
import Navbar from '../components/Navbar';

export default function AppPage() {
  const { user } = useUser();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    cropType: '',
    wasteDescription: '',
    quantity: '',
    quantityUnit: 'kg',
    moistureLevel: '',
    ageOfWaste: '',
    location: '',
    intendedUse: '',
    additionalNotes: ''
  });
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [inputMethod, setInputMethod] = useState('image');
  const [description, setDescription] = useState('');
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

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const analyzeWaste = async (data) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response) throw new Error('No response from server');
      const text = await response.text();
      if (!text) throw new Error('Empty response from server');

      const result = JSON.parse(text);
      if (!response.ok) throw new Error(result.error || 'Failed to analyze waste');
      return result;
    } catch (error) {
      console.error('Error analyzing waste:', error);
      throw new Error(error.message || 'Failed to analyze waste. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDescriptionSubmit = async () => {
    if (!description.trim()) {
      alert("Please provide a description of the waste");
      return;
    }

    setIsLoading(true);
    try {
      let dataToSend = { analysisType: 'text', description: description };
      if (image) {
        const base64Image = await convertFileToBase64(image);
        dataToSend = { ...dataToSend, analysisType: 'both', image: base64Image };
      }

      const geminiResponse = await analyzeWaste(dataToSend);
      const geminiData = {
        cropType: geminiResponse.cropType || '',
        wasteDescription: description,
        moistureLevel: geminiResponse.moistureLevel || '',
        ageOfWaste: geminiResponse.ageOfWaste || '',
      };

      let estimatedValue = geminiResponse.estimatedValue;
      if (!estimatedValue || estimatedValue === 0) {
        const defaultPrices = { Rice: 1850, Wheat: 2200, Sugarcane: 1500 };
        estimatedValue = defaultPrices[geminiResponse.cropType] || 1200;
      }

      setFormData(prev => ({ ...prev, ...geminiData }));
      setClassificationResult({
        cropType: geminiResponse.cropType,
        confidence: geminiResponse.confidence,
        moistureLevel: geminiResponse.moistureLevel,
        estimatedValue
      });
      setStep(2);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert(err.message || "Something went wrong while analyzing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const imageBase64 = image ? await convertFileToBase64(image) : null;
      await uploadWasteInfo({
        classificationResult,
        formData,
        imageBase64,
        userId: user?.id,
        userName: user?.name || user?.email || 'Anonymous'
      });
      setStep(3);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setImage(null);
    setPreview(null);
    setClassificationResult(null);
    setFormData({
      cropType: '',
      wasteDescription: '',
      quantity: '',
      quantityUnit: 'kg',
      moistureLevel: '',
      ageOfWaste: '',
      location: '',
      intendedUse: '',
      additionalNotes: ''
    });
    setDescription('');
    setInputMethod('image');
    setStep(1);
  };

  const steps = [
    { number: 1, title: 'Upload Waste Info', color: 'from-emerald-500 to-teal-500' },
    { number: 2, title: 'Review Details', color: 'from-amber-500 to-orange-500' },
    { number: 3, title: 'Complete Listing', color: 'from-blue-500 to-indigo-500' }
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
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-base font-extrabold text-emerald-700">AI-Powered Waste Analysis</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
              Transform Your
              <span className="block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                Agricultural Waste
              </span>
            </h1>

            <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold max-w-3xl mx-auto">
              Upload photos or describe your agricultural waste. Our AI instantly analyzes quality, estimates value, and connects you with verified buyers.
            </p>

            <div className="flex justify-center space-x-4 pt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold shadow-md">
                  {['R', 'P', 'A', 'S'][i]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-emerald-50 to-lime-50 border-b-2 border-emerald-500">
            <div className="grid grid-cols-3 px-8 py-6">
              {steps.map((stepItem, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`relative h-14 w-14 rounded-full flex items-center justify-center mb-3 ${
                    step > stepItem.number 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-4 border-emerald-500' 
                      : step === stepItem.number 
                      ? 'bg-white border-4 border-emerald-500' 
                      : 'bg-gray-100 border-4 border-gray-300'
                  } shadow-lg`}>
                    {step > stepItem.number ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className={`text-xl font-extrabold ${
                        step === stepItem.number ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                        {stepItem.number}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-extrabold uppercase tracking-wide ${
                    step >= stepItem.number ? 'text-emerald-800' : 'text-gray-400'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Image Upload or Description */}
          {step === 1 && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-emerald-800 drop-shadow-lg mb-4">
                  Upload or Describe Your Waste
                </h2>
                <p className="text-lg text-emerald-900 drop-shadow-md font-semibold max-w-2xl mx-auto">
                  Provide a photo (optional) and detailed description of your agricultural waste for AI analysis
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Upload Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-lime-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-extrabold text-emerald-800 mb-6 flex items-center">
                      <FiCamera className="mr-2" />
                      Upload Image (Optional)
                    </h3>
                    
                    {preview ? (
                      <div className="relative group" data-aos="zoom-in">
                        <div className="relative h-64 w-full overflow-hidden rounded-xl border-2 border-emerald-300">
                          <Image
                            src={preview}
                            alt="Waste preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <button
                          onClick={() => {
                            setImage(null);
                            setPreview(null);
                          }}
                          className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all duration-300"
                        >
                          <FiXCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="h-64 w-full border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 group"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full blur opacity-75 group-hover:opacity-100"></div>
                          <div className="relative bg-gradient-to-r from-emerald-400 to-lime-400 p-4 rounded-full">
                            <FiUpload className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-emerald-800">Click to upload image</p>
                        <p className="text-sm text-emerald-700 mt-1">JPG, PNG up to 5MB</p>
                        <p className="text-sm text-emerald-600 mt-2 font-semibold">Optional but recommended for better analysis</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-500 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-500 p-3 rounded-xl">
                        <FiInfo className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-extrabold text-amber-800 mb-2">Tips for Best Results</h4>
                        <ul className="space-y-2 text-amber-900 font-semibold">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                            Take clear, well-lit photos of the waste
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                            Include common objects for scale reference
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                            Capture multiple angles if possible
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-extrabold text-blue-800 mb-6 flex items-center">
                      <FiEdit2 className="mr-2" />
                      Describe Your Waste (Required)
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-lg font-extrabold text-blue-800 mb-3">
                          Detailed Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full h-48 p-4 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
                          placeholder="Describe your agricultural waste in detail:
• Type of crop (e.g., rice straw, wheat husk)
• Condition (fresh, dry, partially decomposed)
• Approximate quantity
• Storage conditions
• Any visible issues or contaminants"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-extrabold text-blue-800 mb-2">
                            Input Method Preference
                          </label>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setInputMethod('image')}
                              className={`px-4 py-2 rounded-lg font-extrabold transition-all duration-300 ${
                                inputMethod === 'image' 
                                  ? 'bg-emerald-600 text-white shadow-lg' 
                                  : 'bg-white border-2 border-emerald-300 text-emerald-700 hover:border-emerald-500'
                              }`}
                            >
                              With Image
                            </button>
                            <button
                              onClick={() => setInputMethod('text')}
                              className={`px-4 py-2 rounded-lg font-extrabold transition-all duration-300 ${
                                inputMethod === 'text' 
                                  ? 'bg-emerald-600 text-white shadow-lg' 
                                  : 'bg-white border-2 border-emerald-300 text-emerald-700 hover:border-emerald-500'
                              }`}
                            >
                              Text Only
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleDescriptionSubmit}
                    disabled={!description.trim() || isLoading}
                    className="group relative w-full px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Analyzing with AI...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-3">
                        <span>Analyze Waste with AI</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Waste Details Form */}
          {step === 2 && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-emerald-800 drop-shadow-lg mb-4">
                  Review AI Analysis & Complete Details
                </h2>
                <p className="text-lg text-emerald-900 drop-shadow-md font-semibold max-w-2xl mx-auto">
                  Verify the AI's predictions and provide additional information for accurate valuation
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* AI Result Summary */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-emerald-800">AI Analysis Results</h3>
                  </div>

                  {classificationResult && (
                    <div className="space-y-6">
                      <div className="bg-white border-2 border-emerald-300 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-extrabold text-emerald-800">Crop Type</span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                            {Math.round(classificationResult.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-2xl font-extrabold text-emerald-900">{classificationResult.cropType}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-emerald-300 rounded-xl p-4">
                          <span className="text-sm font-bold text-emerald-700">Moisture Level</span>
                          <p className="text-lg font-extrabold text-emerald-900">{classificationResult.moistureLevel}</p>
                        </div>
                        <div className="bg-white border-2 border-emerald-300 rounded-xl p-4">
                          <span className="text-sm font-bold text-emerald-700">Estimated Value</span>
                          <p className="text-lg font-extrabold text-emerald-900">
                            ₹{classificationResult.estimatedValue}/ton
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(1)}
                        className="w-full px-4 py-2 border-2 border-emerald-500 text-emerald-700 rounded-lg font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>↺ Re-upload or Modify Description</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-extrabold text-emerald-800 mb-6">Complete Listing Details</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                            Crop Type
                          </label>
                          <select
                            name="cropType"
                            value={formData.cropType}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            required
                          >
                            <option value="">Select crop type</option>
                            <option value="Rice">Rice</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Sugarcane">Sugarcane</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                            Moisture Level
                          </label>
                          <select
                            name="moistureLevel"
                            value={formData.moistureLevel}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            required
                          >
                            <option value="">Select moisture level</option>
                            <option value="Low">Low (Dry)</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High (Wet)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                          Waste Description
                        </label>
                        <textarea
                          name="wasteDescription"
                          value={formData.wasteDescription}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            placeholder="e.g. 2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                            Unit
                          </label>
                          <select
                            name="quantityUnit"
                            value={formData.quantityUnit}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            required
                          >
                            <option value="kg">Kilograms (kg)</option>
                            <option value="ton">Tons</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                            Age of Waste
                          </label>
                          <select
                            name="ageOfWaste"
                            value={formData.ageOfWaste}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            required
                          >
                            <option value="">Select age</option>
                            <option value="Fresh">Fresh (0–1 week)</option>
                            <option value="1-2 weeks">1–2 weeks</option>
                            <option value="2-4 weeks">2–4 weeks</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            placeholder="Nearest landmark"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-extrabold text-emerald-800 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          name="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full p-3 border-2 border-emerald-300 rounded-lg bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          placeholder="Special instructions or details..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300 flex-1"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative px-8 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-[1.02] flex-1 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Submit Waste Listing</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 mb-6">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-emerald-800 drop-shadow-lg mb-4">
                  Waste Successfully Listed!
                </h2>
                <p className="text-lg text-emerald-900 drop-shadow-md font-semibold max-w-2xl mx-auto">
                  Your agricultural waste is now visible to our network of 500+ verified buyers
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-extrabold text-emerald-800 mb-6">Listing Summary</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Crop Type', value: formData.cropType },
                      { label: 'Quantity', value: `${formData.quantity} ${formData.quantityUnit}` },
                      { label: 'Moisture Level', value: formData.moistureLevel },
                      { label: 'Age of Waste', value: formData.ageOfWaste },
                      { label: 'Location', value: formData.location },
                      { 
                        label: 'Estimated Value', 
                        value: `₹${Math.round(classificationResult?.estimatedValue * parseFloat(formData.quantity || 1))} (₹${classificationResult?.estimatedValue}/ton)` 
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-emerald-200 last:border-0">
                        <span className="font-bold text-emerald-700">{item.label}</span>
                        <span className="font-extrabold text-emerald-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-extrabold text-blue-800 mb-6">What Happens Next?</h3>
                    <div className="space-y-4">
                      {[
                        { num: '1', title: 'Buyers Review', desc: 'Verified industrial buyers review your listing and submit offers' },
                        { num: '2', title: 'Receive Offers', desc: 'Get multiple competitive offers to compare prices and terms' },
                        { num: '3', title: 'Finalize Deal', desc: 'Accept the best offer, arrange logistics, and get paid upon delivery' },
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold">
                            {step.num}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-blue-800">{step.title}</h4>
                            <p className="text-blue-900 font-semibold">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview Image */}
                  {preview && (
                    <div className="border-2 border-emerald-500 rounded-2xl overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={preview}
                          alt="Waste preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="bg-emerald-100 p-3">
                        <p className="text-sm font-extrabold text-emerald-800 text-center">Uploaded Image Preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetProcess}
                  className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>List Another Waste</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300 text-center"
                >
                  View Your Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Stats Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-lime-500 border-y-4 border-emerald-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '95%', label: 'AI Accuracy' },
              { value: '500+', label: 'Verified Buyers' },
              { value: '< 2min', label: 'Analysis Time' },
              { value: '₹25Cr+', label: 'Total Transactions' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-wide opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-emerald-500 text-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-emerald-500 p-2 rounded-xl">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-800">AgriLink</span>
            </div>
            <p className="text-emerald-700 font-semibold max-w-md mx-auto mb-6">
              Transforming agricultural waste into valuable resources through AI-powered marketplace.
            </p>
            <p className="text-sm text-emerald-600 font-bold">
              © 2025 AgriLink. All rights reserved.
            </p>
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