import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Filter } from 'lucide-react';

export default function Filters({ searchTerm, setSearchTerm, activeFilter, setActiveFilter, sortConfig, requestSort, displaySales, displaySalesData }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-2 border-emerald-500">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-emerald-600" />
            </div>
            <input
              type="text"
              placeholder="Search items or descriptions..."
              className="w-full pl-12 pr-4 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {['all', 'completed', 'pending'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all duration-300 border-2 capitalize ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white border-emerald-600 shadow-lg'
                  : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
              }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            className="w-full pl-4 pr-10 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none"
            value={sortConfig.key}
            onChange={(e) => requestSort(e.target.value)}
          >
            <option value="createdAt">Newest First</option>
            <option value="price">Price: High to Low</option>
            <option value="weight">Quantity: High to Low</option>
            <option value="item">Item Name</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Filter className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="text-sm text-emerald-700 font-semibold">
        Showing <span className="font-extrabold">{displaySales.length}</span> of{' '}
        <span className="font-extrabold">{displaySalesData.length}</span> listings
      </div>
    </div>
  );
}
