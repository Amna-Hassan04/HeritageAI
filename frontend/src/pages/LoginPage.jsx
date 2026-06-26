import React, { useState } from 'react';
import { Sparkles, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs before attempting login
      if (!email || !password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      setCurrentPage('home');
    } catch (err) {
      console.error('Login error:', err); // Log for debugging
      
      // Handle different error types
      let errorMessage = 'We couldn\'t sign you in. Please check your email and password and try again.';
      
      if (err?.response?.status === 401) {
        errorMessage = 'Invalid login credentials';
      } else if (err?.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message && !err.message.includes('fetch')) {
        errorMessage = err.message;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue exploring</p>
        </div>

        {/* Beautiful error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 px-4 py-3 text-sm shadow-sm animate-shake">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-amber-900">Unable to sign in</p>
                <p className="mt-1 text-amber-800">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="ml-3 inline-flex rounded-full p-1 text-amber-500 transition hover:bg-amber-100 hover:text-amber-700"
                aria-label="Close error message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            {/* <button
              type="button"
              onClick={() => setCurrentPage('forgot-password')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Forgot password?
            </button> */}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('signup')}
            className="text-amber-600 font-semibold hover:text-amber-700 transition"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;