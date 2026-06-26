import React from 'react';
const WriteArticle = ({ setCurrentPage }) => {
  return (
    <div className='py-11'>
      {/* Write for Us Section */}
<div className="w-full max-w-xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-amber-200">          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interested in Writing for Us?</h2>
            <p className="text-lg text-gray-700 mb-6">
              We're always looking for passionate writers, historians, archaeologists, and heritage enthusiasts to share their knowledge and stories with our community.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-6 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">We're looking for articles about:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>South Asian Heritage:</strong> Historical sites, artifacts, cultural traditions, and archaeological discoveries</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>AI & Technology:</strong> How technology is transforming heritage preservation and cultural education</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Personal Stories:</strong> Your experiences with artifacts, family heirlooms, or cultural heritage discoveries</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('submit-article')}
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
              >
                Submit Your Article
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors inline-block"
              >
                Learn More
              </button>
            </div>
          </div>
        </div> 

    </div>
  );
};

export default WriteArticle;