import React from 'react';
import { MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { getSiteById } from '../data/sitesData';

const SitePage = ({ siteId, setCurrentPage }) => {
  const site = getSiteById(siteId);

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Site Not Found</h2>
          <button onClick={() => setCurrentPage('sites')} className="text-amber-600 hover:text-amber-700">
            Back to Sites
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gray-900">
        <img src={site.detailImage} alt={site.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{site.name}</h1>
            <p className="text-2xl">{site.fullEra}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 text-gray-600 mb-6">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{site.location}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-lg text-gray-700 mb-8">{site.description}</p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">History</h2>
          <p className="text-lg text-gray-700 mb-8">{site.history}</p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Significance</h2>
          <p className="text-lg text-gray-700 mb-8">{site.significance}</p>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">AR Experience Coming Soon</h3>
                <p className="text-amber-800">Experience {site.name} in augmented reality. Walk through ancient streets, see reconstructed buildings, and interact with artifacts in their original context.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Location</h2>
          <div className="rounded-lg overflow-hidden h-96 mb-8">
            <iframe
              src={site.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          <button onClick={() => setCurrentPage('sites')} className="text-amber-600 font-semibold flex items-center space-x-2 hover:text-amber-700">
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to All Sites</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitePage;