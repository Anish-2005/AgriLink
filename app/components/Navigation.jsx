import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Navigation({ isScrolled, user, signinBtnLoading, setUser, setSigninBtnLoading }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <Logo size={44} showText={true} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className={`text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 ${
              isScrolled ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-800 hover:text-emerald-900'
            }`}>
              Features
            </a>
            <a href="#how-it-works" className={`text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 ${
              isScrolled ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-800 hover:text-emerald-900'
            }`}>
              How It Works
            </a>
            <a href="#testimonials" className={`text-base font-bold uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-emerald-500 ${
              isScrolled ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-800 hover:text-emerald-900'
            }`}>
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
  );
}