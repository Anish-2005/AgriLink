import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { FiShoppingCart } from 'react-icons/fi';
import { ArrowRight } from 'lucide-react';

export default function TenderCard({ tender, index, getDaysLeft, getStatusBadge }) {
  return (
    <div
      className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="p-6 border-b border-emerald-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-extrabold text-emerald-800 group-hover:text-emerald-900">{tender.title}</h3>
              {getStatusBadge(tender.status)}
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <p className="text-emerald-700 font-semibold">{tender.company} • Verified</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-200 rounded-xl px-3 py-1">
            <span className="text-sm font-extrabold text-emerald-800">{tender.wasteType}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-emerald-700 font-bold mb-1">Quantity</p>
            <p className="text-2xl font-extrabold text-emerald-800">{tender.quantity} tons</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-700 font-bold mb-1">Price/Ton</p>
            <p className="text-2xl font-extrabold text-amber-800">₹{tender.pricePerTon}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700 font-bold">Location</p>
                <p className="text-lg font-extrabold text-blue-800">{tender.location}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-violet-600" />
              <div>
                <p className="text-sm text-violet-700 font-bold">Deadline</p>
                <p className="text-lg font-extrabold text-violet-800">{getDaysLeft(tender.deadline)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-extrabold text-emerald-800 mb-3">Requirements:</p>
          <div className="flex flex-wrap gap-2">
            {tender.requirements.split(', ').map((req, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                {req}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-emerald-100">
          <div>
            <p className="text-xs text-emerald-700 font-bold uppercase">Order Range</p>
            <p className="text-lg font-extrabold text-emerald-800">{tender.minOrder} - {tender.maxOrder} tons</p>
          </div>
          <button
            className={`px-6 py-3 rounded-xl font-extrabold transition-all duration-300 flex items-center space-x-2 ${
              tender.status === 'closed'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'group relative bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
            }`}
            disabled={tender.status === 'closed'}
          >
            {tender.status === 'closed' ? (
              <span>Closed</span>
            ) : (
              <>
                <FiShoppingCart className="h-5 w-5" />
                <span>Submit Bid</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
