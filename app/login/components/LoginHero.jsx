import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@civic/auth/react';

export default function LoginHero({ user, isLoading, signOut }) {
  return (
    <div className="grid grid-cols-1 place-items-center lg:place-items-start gap-12">
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
  );
}
