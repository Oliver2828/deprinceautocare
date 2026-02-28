import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddDailySales = () => {
  const [formData, setFormData] = useState({
    date: '',
    product: '',
    quantity: '',
    unitPrice: '',
    total: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, when: 'beforeChildren' },
    },
  };
  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 20 } },
  };

  // Auto-calculate total when quantity or unitPrice changes
  useEffect(() => {
    setFormData((prev) => {
      const qty = parseFloat(prev.quantity) || 0;
      const price = parseFloat(prev.unitPrice) || 0;
      return { ...prev, total: qty * price };
    });
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newVal = value;
    if (type === 'number') {
      // allow empty string so input appears blank
      if (value === '') newVal = '';
      else newVal = parseFloat(value) || 0;
    }
    setFormData((prev) => ({ ...prev, [name]: newVal }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sales entry submitted:', formData);
    // Simulate API call
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // Reset form to empty values
    setFormData({
      date: '',
      product: '',
      quantity: '',
      unitPrice: '',
      total: 0,
    });
  };

  const handleClear = () => {
    setFormData({
      date: '',
      product: '',
      quantity: '',
      unitPrice: '',
      total: 0,
    });
  };

  // Icons (simple SVGs)
  const CalendarIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const PackageIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  const NumberIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  );

  const CurrencyIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Daily Sales
          </h2>
          <p className="text-red-100 text-sm mt-1">Enter the details of your sale below</p>
        </motion.div>

        <div className="p-6 md:p-8">
          {/* Success message */}
<AnimatePresence>
            {showSuccess && (
              <motion.div
                className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sale added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form and Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <motion.form
                onSubmit={handleSubmit}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {/* Date field with icon */}
                <motion.div variants={fieldVariants} className="relative">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
                      required
                    />
                  </div>
                </motion.div>

                {/* Product field */}
                <motion.div variants={fieldVariants} className="relative">
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                    Product / Service
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PackageIcon />
                    </div>
                    <input
                      type="text"
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      placeholder="e.g. Coffee, T‑shirt, Consultation"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
                      required
                    />
                  </div>
                </motion.div>

                {/* Quantity and Unit Price side by side */}
                <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <NumberIcon />
                      </div>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        step="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price (₦)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyIcon />
                      </div>
                      <input
                        type="number"
                        id="unitPrice"
                        name="unitPrice"
                        min="0"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Total field (read-only) */}
                <motion.div variants={fieldVariants} className="relative">
                  <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                    Total (₦)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyIcon />
                    </div>
                    <input
                      type="number"
                      id="total"
                      name="total"
                      value={formData.total.toFixed(2)}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 bg-red-50 border border-red-200 text-gray-900 font-semibold rounded-lg cursor-not-allowed"
                    />
                  </div>
                </motion.div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Add Sale
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Clear
                  </button>
                </div>
              </motion.form>
            </div>

            {/* Preview Card */}
            <motion.div
              variants={fieldVariants}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-inner"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-gray-800">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Product:</span>
                  <span className="font-medium text-gray-800">{formData.product || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-medium text-gray-800">{formData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unit Price:</span>
                  <span className="font-medium text-gray-800">
                    ₦{(parseFloat(formData.unitPrice) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-gray-700">Total:</span>
                    <span className="text-red-600">₦{formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400 italic">
                * Review your entry before submitting.
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer note */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">
          All fields are required. Total is automatically calculated.
        </div>
      </div>
    </div>
  );
};

export default AddDailySales;