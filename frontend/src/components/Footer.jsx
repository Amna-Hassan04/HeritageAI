import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">HeritageAI</span>
            </div>
            <p className="text-gray-400">Exploring South Asian heritage through AI technology</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setCurrentPage('upload')} className="hover:text-white">Upload Artifact</button></li>
              <li><button onClick={() => setCurrentPage('sites')} className="hover:text-white">Heritage Sites</button></li>
              <li><button onClick={() => setCurrentPage('pricing')} className="hover:text-white">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">About</button></li>
              <li><button onClick={() => setCurrentPage('blog')} className="hover:text-white">Blog</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 HeritageAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;