import React from 'react';
import { FiTarget } from 'react-icons/fi';

export default function Transactions({ loading, transactions, formatDate, getActionIcon }) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-emerald-800 drop-shadow-lg">CO₂ Saving Actions</h2>
          <p className="text-emerald-900 font-semibold mt-2">Track your sustainable actions and carbon token earnings</p>
        </div>
        <div className="text-sm text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-xl border-2 border-emerald-300">
          Total: {transactions.length} Actions
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-emerald-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-emerald-50 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300 rounded-xl p-3">
                      {getActionIcon(tx.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-emerald-800">{tx.action}</h4>
                      <p className="text-emerald-700 font-semibold capitalize">{tx.type.replace('_', ' ')}</p>
                      <p className="text-sm text-emerald-600 mt-1">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-700">CO₂ Saved</p>
                      <p className="text-xl font-extrabold text-emerald-800">{tx.co2} kg</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-700">Tokens Earned</p>
                      <p className="text-xl font-extrabold text-green-600">+{tx.tokens}</p>
                    </div>
                    
                    <div>
                      {tx.status === 'completed' ? (
                        <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-sm font-extrabold rounded-full shadow-md">Verified</span>
                      ) : (
                        <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-extrabold rounded-full shadow-md">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 mb-6">
              <FiTarget className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">No CO₂ actions yet</h3>
            <p className="text-emerald-700 font-semibold mb-8">Your sustainable actions will appear here once you start selling waste</p>
            <button className="group relative px-8 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-500">
              <span className="flex items-center space-x-2">
                <span>Start Selling Waste</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
