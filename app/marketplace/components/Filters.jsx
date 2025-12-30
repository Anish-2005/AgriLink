import { FiSearch } from 'react-icons/fi';
import { Filter, Package } from 'lucide-react';

export default function Filters({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  selectedWasteType,
  setSelectedWasteType,
  wasteTypes,
  activeTab,
  setActiveTab
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-2 border-emerald-500">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-emerald-600" />
            </div>
            <input
              type="text"
              placeholder="Search tenders, companies, locations..."
              className="w-full pl-12 pr-4 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="quantity-high">Quantity: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Filter className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none"
              value={selectedWasteType}
              onChange={(e) => setSelectedWasteType(e.target.value)}
            >
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Tenders' },
          { id: 'open', label: 'Open' },
          { id: 'closing', label: 'Closing Soon' },
          { id: 'closed', label: 'Closed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-extrabold transition-all duration-300 border-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white border-emerald-600 shadow-lg'
                : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
