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
import Footer from '../components/Footer';

import Hero from './components/Hero';
import ProgressSteps from './components/ProgressSteps';
import UploadStep from './components/UploadStep';
import ReviewStep from './components/ReviewStep';
import CompleteStep from './components/CompleteStep';


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
    // Build the same prompt used by the server so client and server behave consistently
    const { image, description, analysisType, cropType, wasteDescription, quantity, moistureLevel, age } = data || {};
    const prompt = `
    You are an expert agricultural waste classification assistant. 
    Analyze the provided waste information and return complete data in the specified JSON format.

    For image analysis, examine the visual characteristics.
    For text analysis, use the provided description.

    Required Output Format:
    {
      "cropType": "string (Rice/Wheat/Sugarcane)",
      "wasteType": "string (stubble/straw/stalk/bagasse/bran)",
      "wasteDescription": "string (detailed description)",
      "quantity": "number",
      "quantityUnit": "string (kg/ton)",
      "moistureLevel": "string (Low/Medium/High)",
      "ageOfWaste": "string (Fresh/1-2 weeks/2-4 weeks/1-2 months/2+ months)",
      "qualityAssessment": {
        "condition": "string",
        "contamination": "string (Present/Not present)"
      },
      "suggestedUses": ["array", "of", "suggestions"],
      "estimatedValue": "number (INR per ton)",
      "confidence": "number (0-1)",
      "notes": "string (additional observations)"
    }

    ${analysisType === 'image' ? 
      'Analyze this agricultural waste image:' : 
      `Analyze this description:\nCrop Type: ${cropType || 'Not specified'}\nWaste Description: ${description}\nQuantity: ${quantity || 'Not specified'}\nMoisture Level: ${moistureLevel || 'Not specified'}\nAge of Waste: ${age || 'Not specified'}`
    }

    Provide complete output in exact specified JSON format.
    `;

    // If Puter.js is loaded on the client, prefer calling it directly (no server key needed)
    try {
      if (typeof window !== 'undefined' && window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        // If image is provided, Puter supports (prompt, imageUrl) style; we pass base64 if available
        let puterResp;
        if (analysisType === 'image' && image) {
          puterResp = await window.puter.ai.chat(prompt, image, { model: 'gemini-3-pro-preview' });
        } else {
          puterResp = await window.puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' });
        }

        // Extract text from various possible fields
        const text = puterResp?.output_text || puterResp?.response || puterResp?.text || puterResp?.choices?.[0]?.message?.content || puterResp?.choices?.[0]?.text || (typeof puterResp === 'string' ? puterResp : JSON.stringify(puterResp));

        // Attempt to parse JSON from the response text
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const jsonString = text.slice(jsonStart, jsonEnd).trim();
        try {
          const dataObj = JSON.parse(jsonString);
          return dataObj;
        } catch (parseErr) {
          console.error('Failed to parse Puter client response:', parseErr, 'raw:', text);
          throw new Error('Puter client parse error - ' + (parseErr.message || parseErr.toString()));
        }
      }
    } catch (clientErr) {
      console.warn('Puter client call failed, falling back to server:', clientErr);
      // continue to server fallback
    }

    // Fallback: call server endpoint which may proxy to Puter or another provider
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response) throw new Error('No response from server');
      const text = await response.text();
      if (!text) throw new Error('Empty response from server');

      let result = null;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        // keep result null and include raw text in error below
      }

      if (!response.ok) {
        const serverErr = result?.error || 'Puter API error';
        const details = result?.details || result?.rawResponse || text;
        console.error('Puter API error details:', details);
        throw new Error(`${serverErr}${details ? ' - ' + (typeof details === 'string' ? details : JSON.stringify(details)) : ''}`);
      }

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

      <Hero />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
          <ProgressSteps steps={steps} step={step} />

          {step === 1 && (
            <UploadStep
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              preview={preview}
              inputMethod={inputMethod}
              setInputMethod={setInputMethod}
              description={description}
              setDescription={setDescription}
              handleDescriptionSubmit={handleDescriptionSubmit}
              setImage={setImage}
              setPreview={setPreview}
              setStep={setStep}
              isLoading={isLoading}
            />
          )}

          {step === 2 && (
            <ReviewStep
              formData={formData}
              handleInputChange={handleInputChange}
              classificationResult={classificationResult}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              preview={preview}
              resetProcess={resetProcess}
            />
          )}

          {step === 3 && (
            <CompleteStep resetProcess={resetProcess} />
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