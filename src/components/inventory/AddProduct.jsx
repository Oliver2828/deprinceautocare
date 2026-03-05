// AddProduct.jsx - Enhanced Add Product Form
import React, { useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Save, Package, AlertCircle, CheckCircle } from 'lucide-react'

function AddProduct() {
  const [rows, setRows] = useState([
    { name: '', category: '', quantity: '', price: '' }
  ])
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = [
    'Engine Parts',
    'Lubricants',
    'Tyres',
    'Batteries',
    'Brakes',
    'Filters',
    'Accessories',
    'Other'
  ]

  const handleChange = (index, field, value) => {
    const updated = [...rows]
    updated[index][field] = value
    setRows(updated)
    
    // Clear error for this field
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
    if (!row.name.trim()) rowErrors[`${index}-name`] = 'Product name is required'
    if (!row.category) rowErrors[`${index}-category`] = 'Category is required'
    if (!row.quantity) rowErrors[`${index}-quantity`] = 'Quantity is required'
    else if (row.quantity <= 0) rowErrors[`${index}-quantity`] = 'Quantity must be positive'
    if (!row.price) rowErrors[`${index}-price`] = 'Price is required'
    else if (row.price <= 0) rowErrors[`${index}-price`] = 'Price must be positive'
    return rowErrors
  }

  const handleSubmit = async () => {
    // Validate all rows
    let allErrors = {}
    rows.forEach((row, index) => {
      allErrors = { ...allErrors, ...validateRow(row, index) }
    })

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      alert('Please fix the errors before saving.')
      return
    }

    // prepare payload for backend
    const payload = rows.map((row, i) => ({
      brand: 'DePrince AutoCare',
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

      // show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // reset form
      setRows([{ name: '', category: '', quantity: '', price: '' }])
      setErrors({})

      // notify other components (product list, sales form) that inventory changed
      window.dispatchEvent(new Event('inventory-updated'))
    } catch (err) {
      console.error('Failed to save products', err)
      alert('Failed to save products. Make sure you are logged in.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Products</h1>
              <p className="text-sm text-gray-500 mt-1">
                Add new products to your inventory
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={addRow}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span className="font-medium">Add Row</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-24 right-6 z-50 animate-slide-in">
            <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-800 font-medium">Products saved successfully!</p>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-red-600 to-red-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-16">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Price (₦)</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-red-50/30 transition group ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-500">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <input
                          value={row.name}
                          onChange={(e) => handleChange(index, 'name', e.target.value)}
                          placeholder="e.g. Engine Oil 5W-30"
                          className={`w-full px-3 py-2 border ${
                            errors[`${index}-name`] 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-200'
                          } rounded-lg text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition`}
                        />
                        {errors[`${index}-name`] && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors[`${index}-name`]}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <select
                          value={row.category}
                          onChange={(e) => handleChange(index, 'category', e.target.value)}
                          className={`w-full px-3 py-2 border ${
                            errors[`${index}-category`]
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200'
                          } rounded-lg text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition bg-white`}
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors[`${index}-category`] && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors[`${index}-category`]}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        DePrince AutoCare
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <input
                          type="number"
                          value={row.quantity}
                          onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                          placeholder="0"
                          min="0"
                          className={`w-24 px-3 py-2 border ${
                            errors[`${index}-quantity`]
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200'
                          } rounded-lg text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition`}
                        />
                        {errors[`${index}-quantity`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`${index}-quantity`]}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) => handleChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-28 px-3 py-2 border ${
                            errors[`${index}-price`]
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200'
                          } rounded-lg text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition`}
                        />
                        {errors[`${index}-price`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`${index}-price`]}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => removeRow(index)}
                          disabled={rows.length === 1}
                          className={`p-2 rounded-lg transition ${
                            rows.length === 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">Items to add</p>
                <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500">Estimated total value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{rows.reduce((sum, row) => sum + (Number(row.price) * Number(row.quantity) || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500">Categories selected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(rows.map(r => r.category).filter(Boolean)).size}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all transform hover:-translate-y-0.5 font-semibold"
            >
              <Save size={18} />
              Save All Products
            </button>
          </div>
        </div>
      </div>

      {/* Add this CSS to your global styles or component */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default AddProduct





// import React, { useState } from 'react'

// function AddProduct() {
//   const [rows, setRows] = useState([
//     { name: '', category: '', quantity: '', price: '' }
//   ])

//   const handleChange = (index, field, value) => {
//     const updated = [...rows]
//     updated[index][field] = value
//     setRows(updated)
//   }

//   const addRow = () => {
//     setRows([...rows, { name: '', category: '', quantity: '', price: '' }])
//   }

//   const removeRow = (index) => {
//     if (rows.length === 1) return
//     setRows(rows.filter((_, i) => i !== index))
//   }

//   const handleSubmit = () => {
//     // Validate — make sure no row is empty
//     const hasEmpty = rows.some(row => !row.name || !row.category || !row.quantity || !row.price)
//     if (hasEmpty) {
//       alert('Please fill in all fields before saving.')
//       return
//     }

//     // Get existing products from localStorage
//     const existing = JSON.parse(localStorage.getItem('products') || '[]')

//     // Add id and brand to each new row
//     const newProducts = rows.map((row, i) => ({
//       id: Date.now() + i,
//       brand: 'DePrince AutoCare',
//       name: row.name,
//       category: row.category,
//       quantity: Number(row.quantity),
//       price: Number(row.price),
//     }))

//     // Merge and save
//     const updated = [...existing, ...newProducts]
//     localStorage.setItem('products', JSON.stringify(updated))

//     // Reset form
//     setRows([{ name: '', category: '', quantity: '', price: '' }])
//     alert(`${newProducts.length} product${newProducts.length > 1 ? 's' : ''} saved successfully!`)
//   }

//   return (
//     <div className="p-6">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Add Products</h2>
//           <p className="text-sm text-gray-400 mt-0.5">All products are under <span className="text-red-500 font-semibold">DePrince AutoCare</span></p>
//         </div>
//         <button
//           onClick={addRow}
//           className="flex items-center gap-2 bg-gradient-to-br from-red-600 to-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition"
//         >
//           + Add Row
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <table className="w-full text-sm">

//           <thead>
//             <tr className="bg-gradient-to-br from-red-600 to-red-700 text-white">
//               <th className="text-left px-4 py-3 font-semibold">#</th>
//               <th className="text-left px-4 py-3 font-semibold">Product Name</th>
//               <th className="text-left px-4 py-3 font-semibold">Category</th>
//               <th className="text-left px-4 py-3 font-semibold">Brand</th>
//               <th className="text-left px-4 py-3 font-semibold">Quantity</th>
//               <th className="text-left px-4 py-3 font-semibold">Price (₦)</th>
//               <th className="px-4 py-3"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row, index) => (
//               <tr
//                 key={index}
//                 className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 <td className="px-4 py-3 text-gray-400 font-medium">{index + 1}</td>

//                 <td className="px-4 py-3">
//                   <input
//                     value={row.name}
//                     onChange={(e) => handleChange(index, 'name', e.target.value)}
//                     placeholder="e.g. Engine Oil"
//                     className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-400 transition bg-white"
//                   />
//                 </td>

//                 <td className="px-4 py-3">
//                   <select
//                     value={row.category}
//                     onChange={(e) => handleChange(index, 'category', e.target.value)}
//                     className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-400 transition bg-white text-gray-600"
//                   >
//                     <option value="">Select</option>
//                     <option value="Engine Parts">Engine Parts</option>
//                     <option value="Lubricants">Lubricants</option>
//                     <option value="Tyres">Tyres</option>
//                     <option value="Batteries">Batteries</option>
//                     <option value="Brakes">Brakes</option>
//                     <option value="Filters">Filters</option>
//                     <option value="Accessories">Accessories</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </td>

//                 <td className="px-4 py-3">
//                   <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
//                     DePrince AutoCare
//                   </span>
//                 </td>

//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={row.quantity}
//                     onChange={(e) => handleChange(index, 'quantity', e.target.value)}
//                     placeholder="0"
//                     className="w-24 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-400 transition bg-white"
//                   />
//                 </td>

//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={row.price}
//                     onChange={(e) => handleChange(index, 'price', e.target.value)}
//                     placeholder="0.00"
//                     className="w-28 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-400 transition bg-white"
//                   />
//                 </td>

//                 <td className="px-4 py-3">
//                   <button
//                     onClick={() => removeRow(index)}
//                     className="text-red-400 hover:text-red-600 transition text-lg font-bold"
//                   >
//                     ×
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-5">
//         <p className="text-sm text-gray-400">{rows.length} item{rows.length > 1 ? 's' : ''} ready to save</p>
//         <button
//           onClick={handleSubmit}
//           className="bg-gradient-to-br from-red-600 to-red-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition"
//         >
//           Save All Products
//         </button>
//       </div>

//     </div>
//   )
// }

// export default AddProduct
// mm