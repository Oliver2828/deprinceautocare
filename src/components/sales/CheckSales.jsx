import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Mock data (unchanged)
const mockSalesData = [
  { id: 1, date: '2026-02-28', product: 'Coffee', quantity: 5, unitPrice: 3.50, total: 17.50 },
  { id: 2, date: '2026-02-28', product: 'Sandwich', quantity: 2, unitPrice: 7.00, total: 14.00 },
  { id: 3, date: '2026-02-27', product: 'T-shirt', quantity: 3, unitPrice: 15.00, total: 45.00 },
  { id: 4, date: '2026-02-27', product: 'Cap', quantity: 1, unitPrice: 12.00, total: 12.00 },
  { id: 5, date: '2026-02-26', product: 'Coffee', quantity: 8, unitPrice: 3.50, total: 28.00 },
];

// Helper to get date presets
const getDatePreset = (preset) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (preset === 'today') return { start: todayStr, end: todayStr };

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
  const startWeekStr = startOfWeek.toISOString().slice(0, 10);
  if (preset === 'week') return { start: startWeekStr, end: todayStr };

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startMonthStr = startOfMonth.toISOString().slice(0, 10);
  if (preset === 'month') return { start: startMonthStr, end: todayStr };

  return { start: '', end: '' };
};

const CheckDailySales = () => {
  // animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  const listContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const listItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Filter sales based on date range
  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return mockSalesData;

    return mockSalesData.filter((sale) => {
      const saleDate = sale.date;
      if (startDate && endDate) {
        return saleDate >= startDate && saleDate <= endDate;
      } else if (startDate) {
        return saleDate >= startDate;
      } else if (endDate) {
        return saleDate <= endDate;
      }
      return true;
    });
  }, [startDate, endDate]);

  // Sort data
  const sortedData = useMemo(() => {
    const sortable = [...filteredData];
    sortable.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [filteredData, sortConfig]);

  // Handle sort request
  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Calculate totals
  const totalSales = filteredData.reduce((acc, sale) => acc + sale.total, 0);
  const totalQuantity = filteredData.reduce((acc, sale) => acc + sale.quantity, 0);
  const averageTicket = filteredData.length ? (totalSales / filteredData.length).toFixed(2) : 0;

  // Apply date preset
  const applyPreset = (preset) => {
    const { start, end } = getDatePreset(preset);
    setStartDate(start);
    setEndDate(end);
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  // Icon components (simple SVGs)
  const CalendarIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const DollarIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CartIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  // Sort indicator
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with gradient */}
        <motion.div className="mb-6" variants={fadeInUp} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold text-gray-800">Daily Sales</h1>
          <p className="text-gray-600">View and filter your sales records</p>
        </motion.div>

        {/* Filter Card */}
        <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center space-x-2 mb-4">
            <CalendarIcon />
            <h2 className="text-lg font-semibold text-gray-800">Date Range</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
              />
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:col-span-2 items-center">
              <button
                onClick={() => applyPreset('today')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition"
              >
                Today
              </button>
              <button
                onClick={() => applyPreset('week')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition"
              >
                This Week
              </button>
              <button
                onClick={() => applyPreset('month')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition"
              >
                This Month
              </button>
              <div className="flex-1 min-w-[200px] flex justify-end gap-2">
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => {}} // filter already applied via useMemo
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards with Icons */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6" variants={listContainer} initial="hidden" animate="visible">
          <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center" variants={listItem}>
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <DollarIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">₦{totalSales.toFixed(2)}</p>
            </div>
          </motion.div>
          <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center" variants={listItem}>
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <CartIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Items Sold</p>
              <p className="text-2xl font-bold text-gray-800">{totalQuantity}</p>
            </div>
          </motion.div>
          <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center" variants={listItem}>
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <TrendingUpIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Ticket</p>
              <p className="text-2xl font-bold text-gray-800">₦{averageTicket}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Sales Table */}
        <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Sales Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['date', 'product', 'quantity', 'unitPrice', 'total'].map((col) => (
                    <th
                      key={col}
                      onClick={() => requestSort(col)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <span className="flex items-center">
                        {col === 'unitPrice' ? 'Unit Price' : col === 'total' ? 'Total' : col}
                        <SortIcon column={col} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.length > 0 ? (
                  sortedData.map((sale) => (
                    <motion.tr key={sale.id} variants={listItem} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₦{sale.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₦{sale.total.toFixed(2)}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No sales found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your date range</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
            Showing {sortedData.length} of {mockSalesData.length} records
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckDailySales;