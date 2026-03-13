// AddProduct.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react'

function AddProduct() {
  const [rows, setRows] = useState([
    { name: '', category: '', quantity: '', price: '' }
  ])
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = [
    'Engine Parts', 'Lubricants', 'Tyres', 'Batteries',
    'Brakes', 'Filters', 'Accessories', 'Other'
  ]

  const handleChange = (index, field, value) => {
    const updated = [...rows]
    updated[index][field] = value
    setRows(updated)
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${index}-${field}`]
      setErrors(newErrors)
    }
  }

  const addRow = () => {
    setRows([...rows, { name: '', category: '', quantity: '', price: '' }])
  }

  const removeRow = (index) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, i) => i !== index))
  }

  const validateRow = (row, index) => {
    const rowErrors = {}
    if (!row.name.trim()) rowErrors[`${index}-name`] = 'Required'
    if (!row.category) rowErrors[`${index}-category`] = 'Required'
    if (!row.quantity || row.quantity <= 0) rowErrors[`${index}-quantity`] = 'Required'
    if (!row.price || row.price <= 0) rowErrors[`${index}-price`] = 'Required'
    return rowErrors
  }

  const handleSubmit = async () => {
    let allErrors = {}
    rows.forEach((row, index) => {
      allErrors = { ...allErrors, ...validateRow(row, index) }
    })
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      return
    }

    const payload = rows.map((row) => ({
      brand: 'Auto_Care',
      name: row.name.trim(),
      category: row.category,
      quantity: Number(row.quantity),
      price: Number(row.price),
      dateAdded: new Date().toISOString(),
    }))

    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/products', payload, {
        baseURL: import.meta.env.VITE_BACKEND_URL || 'https://deprinceautocare-backend.onrender.com',
        headers: { Authorization: `Bearer ${token}` },
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setRows([{ name: '', category: '', quantity: '', price: '' }])
      setErrors({})
      window.dispatchEvent(new Event('inventory-updated'))
    } catch (err) {
      console.error('Failed to save products', err)
      alert('Failed to save products. Make sure you are logged in.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">Add new products to your inventory</p>
          </div>
          <button
            onClick={addRow}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:opacity-90 transition font-medium text-sm w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Row
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600 shrink-0" size={20} />
            <p className="text-green-800 font-medium text-sm">Products saved successfully!</p>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">

        {/* DESKTOP TABLE — hidden on mobile */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-red-600 to-red-700">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Category</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Brand</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Price (₦)</th>
                  <th className="px-4 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={row.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                        placeholder="e.g. Engine Oil 5W-30"
                        className={`w-full px-3 py-2 border ${errors[`${index}-name`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition`}
                      />
                      {errors[`${index}-name`] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors[`${index}-name`]}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.category}
                        onChange={(e) => handleChange(index, 'category', e.target.value)}
                        className={`w-full px-3 py-2 border ${errors[`${index}-category`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition bg-white`}
                      >
                        <option value="">Select</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      {errors[`${index}-category`] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors[`${index}-category`]}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">Auto_Care</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min="0"
                        value={row.quantity}
                        onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                        placeholder="0"
                        className={`w-20 px-3 py-2 border ${errors[`${index}-quantity`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition`}
                      />
                      {errors[`${index}-quantity`] && <p className="text-xs text-red-500 mt-1"><AlertCircle size={11} className="inline" /></p>}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min="0" step="0.01"
                        value={row.price}
                        onChange={(e) => handleChange(index, 'price', e.target.value)}
                        placeholder="0.00"
                        className={`w-28 px-3 py-2 border ${errors[`${index}-price`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition`}
                      />
                      {errors[`${index}-price`] && <p className="text-xs text-red-500 mt-1"><AlertCircle size={11} className="inline" /></p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeRow(index)}
                        disabled={rows.length === 1}
                        className={`p-2 rounded-lg transition ${rows.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARDS — shown only on mobile */}
        <div className="md:hidden flex flex-col gap-4">
          {rows.map((row, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400">#{(index + 1).toString().padStart(2, '0')}</span>
                <button
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                  className={`p-1.5 rounded-lg ${rows.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Product Name</label>
                  <input
                    value={row.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="e.g. Engine Oil 5W-30"
                    className={`w-full px-3 py-2 border ${errors[`${index}-name`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition`}
                  />
                  {errors[`${index}-name`] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors[`${index}-name`]}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
                  <select
                    value={row.category}
                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                    className={`w-full px-3 py-2 border ${errors[`${index}-category`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition bg-white`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors[`${index}-category`] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors[`${index}-category`]}</p>}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Quantity</label>
                    <input
                      type="number" min="0"
                      value={row.quantity}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                      placeholder="0"
                      className={`w-full px-3 py-2 border ${errors[`${index}-quantity`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition`}
                    />
                    {errors[`${index}-quantity`] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />Required</p>}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Price (₦)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={row.price}
                      onChange={(e) => handleChange(index, 'price', e.target.value)}
                      placeholder="0.00"
                      className={`w-full px-3 py-2 border ${errors[`${index}-price`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg text-sm outline-none focus:border-red-400 transition`}
                    />
                    {errors[`${index}-price`] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />Required</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Brand:</span>
                  <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-lg">Auto_Care</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                <p className="text-xs text-gray-500">Items to add</p>
                <p className="text-xl font-bold text-gray-900">{rows.length}</p>
              </div>
              <div className="hidden sm:block h-10 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-500">Est. total value</p>
                <p className="text-xl font-bold text-gray-900">
                  ₦{rows.reduce((sum, row) => sum + (Number(row.price) * Number(row.quantity) || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="hidden sm:block h-10 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-500">Categories</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Set(rows.map(r => r.category).filter(Boolean)).size}
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:opacity-90 transition font-semibold w-full sm:w-auto"
            >
              <Save size={18} />
              Save All Products
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AddProduct