'use client'
import { useEffect, useState } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { useUser } from '@civic/auth/react';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true
    });
  }, []);

  const { user, signIn, signOut } = useUser();
  const [signinBtnLoading, setSigninbtnLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSigninbtnLoading(false);
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50">
      <Head>
        <title>AgriLink | Smart Agricultural Waste Marketplace</title>
        <meta name="description" content="Transform waste into profit with AI-powered agricultural waste marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-green-200 opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-yellow-200 opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-orange-200 opacity-20 animate-blob"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-green-800 bg-opacity-90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex-shrink-0 flex items-center">
                  <svg className="h-8 w-8 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-white">AgriLink</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-6">
              <a href="#features" className="text-green-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="text-green-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300">How It Works</a>
              <a href="#testimonials" className="text-green-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300">Testimonials</a>
              <button className="relative overflow-hidden group inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-800 bg-green-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300" onClick={() => {
                if (user) {
                  signOut();
                }
                else {
                  setSigninbtnLoading(true);
                  signIn();
                }
              }}>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                {signinBtnLoading == false ? <>
                  {user ? <>Log out</> : <>
                    Get Started
                  </>}
                </> :
                  <LoaderCircle size={20} className='animate-spin' />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl" data-aos="fade-right">
                  <span className="block">From Waste to</span>
                  <span className="block text-green-600">Wealth</span>
                </h1>
                <p className="mt-3 text-lg text-gray-700 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0" data-aos="fade-right" data-aos-delay="200">
                  AgriLink's AI-powered platform transforms agricultural waste into valuable resources, creating income for farmers and sustainable materials for industries.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4" data-aos="fade-right" data-aos-delay="400">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                    <Link href="/app">
                      <button className="relative px-6 py-3 bg-green-600 text-white rounded-lg leading-none flex  items-center" onClick={() => {
                        if (!user) {
                          setSigninbtnLoading(true);
                          signIn()
                        }
                        else {
                          router.push("/app");
                        }
                      }}>
                        {signinBtnLoading == false ? (<>
                          <span className="font-medium">{user ? <>Start Selling Waste</> : <>Be a member</>}</span>
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </>) : <LoaderCircle size={20} className='animate-spin' />}
                      </button>
                    </Link>
                  </div>
                  <button className="px-6 py-3 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-300 flex items-center">
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span>How It Works</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            height={56}
            width={100}
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full lg:object-contain lg:object-right"
            src="https://earth.org/wp-content/uploads/2022/03/Untitled-design-2022-03-18T144807.712.jpg"
            alt="Farmer using AgriLink app"
            data-aos="fade-left"
            data-aos-delay="300"
            unoptimized
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Revolutionizing Agricultural Waste
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Our platform combines cutting-edge technology with sustainable solutions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100 hover:border-green-200"
              data-aos="flip-up"
              data-aos-delay="100"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Waste Recognition</h3>
              <p className="text-gray-600">
                Simply snap a photo - our AI instantly identifies waste type and quality with 95% accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100 hover:border-green-200"
              data-aos="flip-up"
              data-aos-delay="200"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Pricing</h3>
              <p className="text-gray-600">
                Real-time market valuation based on demand, quality and location factors.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100 hover:border-green-200"
              data-aos="flip-up"
              data-aos-delay="300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Industry Network</h3>
              <p className="text-gray-600">
                Direct access to 500+ verified buyers across biomass, packaging, and biofuel sectors.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100 hover:border-green-200"
              data-aos="flip-up"
              data-aos-delay="400"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Eco Impact</h3>
              <p className="text-gray-600">
                Track your CO₂ reduction and sustainability contributions in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple 4-Step Process
            </p>
          </div>

          <div className="relative">
            {/* Animated timeline */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-green-400 to-green-600 transform -translate-x-1/2"></div>

            {/* Step 1 */}
            <div className="relative mb-12 md:flex md:items-center md:group" data-aos="fade-right">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white border-4 border-white shadow-xl md:order-1 md:ml-8">
                <span className="text-xl font-bold">1</span>
              </div>
              <div className="mt-6 md:mt-0 md:mr-8 md:flex-1">
                <div className="bg-green-50 p-8 rounded-xl shadow-md border border-green-100 transform transition-all duration-300 group-hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-900">Upload Waste Photo</h3>
                  <p className="mt-4 text-gray-600">
                    Use our mobile app or website to photograph your agricultural waste. Our system accepts images of crop residue, husks, straw, and more.
                  </p>
                  <div className="mt-6">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Mobile App</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Web Upload</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-12 md:flex md:items-center md:group" data-aos="fade-left" data-aos-delay="100">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-4 border-white shadow-xl md:order-1 md:ml-8">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="mt-6 md:mt-0 md:mr-8 md:flex-1">
                <div className="bg-yellow-50 p-8 rounded-xl shadow-md border border-yellow-100 transform transition-all duration-300 group-hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-900">AI Analysis</h3>
                  <p className="mt-4 text-gray-600">
                    Our advanced machine learning models analyze the image to classify waste type, estimate quantity, and assess quality within seconds.
                  </p>
                  <div className="mt-6">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">95% Accuracy</span>
                      <span className="ml-2 text-sm text-gray-500">Instant Results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mb-12 md:flex md:items-center md:group" data-aos="fade-right" data-aos-delay="200">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white border-4 border-white shadow-xl md:order-1 md:ml-8">
                <span className="text-xl font-bold">3</span>
              </div>
              <div className="mt-6 md:mt-0 md:mr-8 md:flex-1">
                <div className="bg-blue-50 p-8 rounded-xl shadow-md border border-blue-100 transform transition-all duration-300 group-hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-900">Receive Offers</h3>
                  <p className="mt-4 text-gray-600">
                    Get multiple competitive offers from verified industrial buyers. Compare prices, buyer ratings, and pickup options.
                  </p>
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Verified Buyers Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative mb-12 md:flex md:items-center md:group" data-aos="fade-left" data-aos-delay="300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white border-4 border-white shadow-xl md:order-1 md:ml-8">
                <span className="text-xl font-bold">4</span>
              </div>
              <div className="mt-6 md:mt-0 md:mr-8 md:flex-1">
                <div className="bg-purple-50 p-8 rounded-xl shadow-md border border-purple-100 transform transition-all duration-300 group-hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-900">Complete Transaction</h3>
                  <p className="mt-4 text-gray-600">
                    Finalize the deal, arrange logistics, and get paid directly to your bank account. Track your environmental impact in your dashboard.
                  </p>
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Secure Payments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {/* Stat 1 */}
            <div className="text-center" data-aos="zoom-in">
              <div className="text-4xl font-extrabold mb-2 relative">
                <span className="counter" data-target="10000">10,000+</span>
                <span className="absolute top-0 right-0 text-green-300 text-xl">+</span>
              </div>
              <div className="text-lg font-medium">Farmers Empowered</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center" data-aos="zoom-in" data-aos-delay="100">
              <div className="text-4xl font-extrabold mb-2 relative">
                <span className="counter" data-target="500">500+</span>
                <span className="absolute top-0 right-0 text-green-300 text-xl">+</span>
              </div>
              <div className="text-lg font-medium">Industrial Partners</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center" data-aos="zoom-in" data-aos-delay="200">
              <div className="text-4xl font-extrabold mb-2 relative">
                ₹<span className="counter" data-target="25">25</span>Cr+
              </div>
              <div className="text-lg font-medium">Waste Monetized</div>
            </div>

            {/* Stat 4 */}
            <div className="text-center" data-aos="zoom-in" data-aos-delay="300">
              <div className="text-4xl font-extrabold mb-2 relative">
                <span className="counter" data-target="100">100K+</span>
                <span className="absolute top-0 right-0 text-green-300 text-xl">+</span>
              </div>
              <div className="text-lg font-medium">CO₂ Tons Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Farmers & Industries
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div
              className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex items-center mb-6">
                <Image height={14} width={14} className="h-14 w-14 rounded-full border-2 border-green-200" src="/farmer-avatar.jpg" alt="Farmer" unoptimized />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-green-600">Rice Farmer, Punjab</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "AgriLink has changed my life. I used to burn my rice straw, now I earn ₹15,000 per acre from selling it. The AI photo system is so easy to use!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex items-center mb-6">
                <Image height={14} width={14} className="h-14 w-14 rounded-full border-2 border-blue-200" src="/industry-avatar.jpg" alt="Industry" unoptimized />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Priya Sharma</h4>
                  <p className="text-blue-600">Biomass Plant Manager</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "We get consistent quality agricultural waste through AgriLink. The platform saves us 30% in procurement costs compared to traditional methods."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div
              className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex items-center mb-6">
                <Image height={14} width={14} className="h-14 w-14 rounded-full border-2 border-purple-200" src="/env-avatar.jpg" alt="Environmentalist" unoptimized/>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Dr. Amit Patel</h4>
                  <p className="text-purple-600">Environmental Scientist</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "AgriLink's model is revolutionary. For every 100 farmers using the platform, we prevent approximately 500 tons of CO₂ emissions annually."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-green-800 to-green-700">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-400 animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-yellow-400 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white animate-blob"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-6" data-aos="fade-up">
            Ready to transform your agricultural waste into profit?
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-green-100 mb-8" data-aos="fade-up" data-aos-delay="100">
            Join thousands of farmers already benefiting from AgriLink's smart marketplace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4" data-aos="fade-up" data-aos-delay="200">
            <button className="relative group px-6 py-3 bg-white text-green-800 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Get Started - It's Free</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300">
              Request Demo
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-white text-lg font-semibold">AgriLink</h3>
              <p className="mt-4 text-gray-400">
                Connecting farmers with industries to create sustainable value from agricultural waste.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-400">contact@agrilink.com</li>
                <li className="text-gray-400">+91 98765 43210</li>
                <li className="text-gray-400">Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex justify-between">
            <p className="text-gray-400">© 2023 AgriLink. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}