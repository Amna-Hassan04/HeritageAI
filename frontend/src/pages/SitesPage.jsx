import React from 'react';
import { ChevronRight } from 'lucide-react';
import { sitesData } from '../data/sitesData';

const SitesPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Heritage Sites</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">Explore Pakistan's ancient civilizations</p>

        <div className="grid md:grid-cols-3 gap-8">
          {sitesData.map(site => (
            <div key={site.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer" onClick={() => setCurrentPage(`site-${site.id}`)}>
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img src={site.image} alt={site.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">{site.name}</h2>
                  <span className="text-sm text-amber-600 font-semibold">{site.era}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{site.description}</p>
                <button className="text-amber-600 font-semibold flex items-center space-x-1 hover:text-amber-700">
                  <span>Explore Site</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitesPage;