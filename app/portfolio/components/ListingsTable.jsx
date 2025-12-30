import React from 'react';
import { FiChevronUp, FiChevronDown, FiPackage } from 'react-icons/fi';
import { Shield } from 'lucide-react';

export default function ListingsTable({ displaySales, displaySalesData, formatDate, formatCurrency, getStatusBadge, requestSort, sortConfig }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-emerald-100">
          <thead className="bg-gradient-to-r from-emerald-50 to-lime-50">
            <tr>
              {[
                { key: 'item', label: 'Item', sortable: true },
                { key: 'price', label: 'Price', sortable: true, align: 'right' },
                { key: 'weight', label: 'Quantity', sortable: true, align: 'right' },
                { key: 'time', label: 'Date', sortable: true, align: 'right' },
                { key: 'total', label: 'Total', sortable: false, align: 'right' },
                { key: 'status', label: 'Status', sortable: false, align: 'right' }
              ].map((column, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-extrabold text-emerald-800 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-emerald-600' : ''
                  } ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                  onClick={column.sortable ? () => requestSort(column.key) : undefined}
                >
                  <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : ''}`}>
                    {column.label}
                    {column.sortable && sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? 
                        <FiChevronUp className="ml-1 h-4 w-4" /> : 
                        <FiChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-emerald-100">
            {displaySales.length > 0 ? (
              displaySales.map((sale) => (
                <tr key={sale.id} className="hover:bg-emerald-50 transition-colors duration-300 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-emerald-100 to-lime-100 rounded-xl border-2 border-emerald-300 flex items-center justify-center">
                        {sale.item?.charAt(0) || 'A'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-extrabold text-emerald-800">{sale.item}</div>
                        <div className="text-sm text-emerald-700 font-semibold">{sale.wasteDescription}</div>
                        <div className="flex items-center mt-1">
                          <Shield className="h-3 w-3 text-emerald-600 mr-1" />
                          <div className="text-xs text-emerald-600">ID: {sale.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-emerald-800">
                    ₹{sale.price}/{sale.quantityUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-emerald-700 font-semibold">
                    {sale.weight} {sale.quantityUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-emerald-700 font-semibold">
                    {formatDate(sale.time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-extrabold text-emerald-800">
                    {formatCurrency(sale.price * sale.weight)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">{getStatusBadge(sale.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-lime-100 border-2 border-emerald-300 mb-6">
                      <FiPackage className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">No listings found</h3>
                    <p className="text-emerald-700 font-semibold mb-8 max-w-md">Try adjusting your search or filter criteria, or start selling your agricultural waste</p>
                    <button className="group relative px-8 py-3 bg-emerald-600 text-white rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-500">
                      <span className="flex items-center space-x-2">
                        <span>Start Selling Waste</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {displaySales.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-lime-50 px-6 py-4 border-t-2 border-emerald-300">
          <div className="flex justify-between items-center">
            <div className="text-emerald-800 font-semibold">
              <span className="font-extrabold">{displaySales.length}</span> listings shown •{' '}
              <span className="font-extrabold">{displaySalesData.length}</span> total
            </div>
            <div className="flex space-x-8">
              <div className="text-right">
                <p className="text-sm text-emerald-700 font-bold">Total Quantity</p>
                <p className="text-lg font-extrabold text-emerald-800">{displaySales.reduce((sum, item) => sum + item.weight, 0)} {displaySalesData[0]?.quantityUnit || 'kg'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-700 font-bold">Total Value</p>
                <p className="text-lg font-extrabold text-emerald-800">{formatCurrency(displaySales.reduce((sum, item) => sum + (item.price * item.weight), 0))}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
