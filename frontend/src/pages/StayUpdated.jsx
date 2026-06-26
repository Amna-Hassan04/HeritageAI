import React from 'react';
const StayUpdated = () => {
  return (
       <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
         {/* Newsletter Signup */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Stay Updated</h2>
          <p className="text-gray-700 mb-6 text-center max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest insights on AI, heritage preservation, and cultural discoveries from across South Asia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
              Subscribe
            </button>
          </div>
      </div>
    );
};
export default StayUpdated;