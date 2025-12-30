import Link from 'next/link';
import { Leaf } from 'lucide-react';
import Logo from '../../components/Logo';

export default function LoginNav({ isScrolled }) {
  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <Logo size={44} showText={true} />
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
  );
}
