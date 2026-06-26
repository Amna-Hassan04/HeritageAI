import React, { useState } from 'react';
import { Sparkles, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HeritageAI</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-amber-600 transition">Home</button>
            <button onClick={() => setCurrentPage('sites')} className="text-gray-700 hover:text-amber-600 transition">Heritage Sites</button>
            {user && (
              <button onClick={() => setCurrentPage('ar')} className="text-gray-700 hover:text-amber-600 transition">Upload Artifact</button>
            )}
            <button
              onClick={() => setCurrentPage('planner')}
              className={`text-gray-700 hover:text-amber-600 transition ${
                currentPage === 'planner'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              Tour Planner
            </button>
            <button
              onClick={() => setCurrentPage('learn-ar')}
              className={`text-gray-700 hover:text-amber-600 transition ${
                currentPage === 'learn-ar'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              Learn with AR
            </button>
            
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button onClick={() => setCurrentPage('profile')} className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition">
                  <User className="w-5 h-5" />
                  <span>{user.user_metadata?.full_name || 'User'}</span>
                </button>
                <button onClick={logout} className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-amber-600 transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage('login')} className="text-gray-700 hover:text-amber-600 transition">Login</button>
                <button onClick={() => setCurrentPage('signup')} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">Sign Up</button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">Home</button>
            <button onClick={() => { setCurrentPage('sites'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">Heritage Sites</button>
            {user && (
              <button onClick={() => { setCurrentPage('ar'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">Upload Artifact</button>
            )}
            <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">About</button>
            {user ? (
              <>
                <button onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">Profile</button>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-amber-600">Login</button>
                <button onClick={() => { setCurrentPage('signup'); setMobileMenuOpen(false); }} className="block w-full text-left bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;