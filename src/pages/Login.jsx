import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Video from '../components/Video';

function Login() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Test credentials for demo
  const testCredentials = {
    email: 'demo@example.com',
    password: 'password123'
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (email === testCredentials.email && password === testCredentials.password) {
        // Successful login (no state switching)
        console.log('Login successful!');
        alert('Login successful! Welcome back!');
      } else {
        // Failed login
        setLoginError('Invalid email or password. Try: demo@example.com / password123');
      }
      setIsLoading(false);
    }, 1000);
  };
  

  // Auto-fill demo credentials for testing
  const fillDemoCredentials = () => {
    setEmail(testCredentials.email);
    setPassword(testCredentials.password);
    setLoginError('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full my-[80px] max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Column: Video/Visual Section */}
        <Video />
        {/* Right Column: Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-400 rounded-2xl shadow-lg mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
            </div>
            
            {/* Login form (always shown) */}
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>
                  
                  
                  {loginError && (
                    <motion.div
                      className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{loginError}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-400 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                  
                  
                  
                  
                  
                </div>
              </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;