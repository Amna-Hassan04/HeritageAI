import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About HeritageAI</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-6">
            HeritageAI is dedicated to making South Asian cultural heritage accessible to everyone. We combine cutting-edge artificial intelligence with rich historical knowledge to create immersive, educational experiences that bring ancient civilizations to life.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why HeritageAI?</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Built for South Asia:</strong> Specialized knowledge of Pakistani and regional heritage sites</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>AI-Powered:</strong> Instant artifact identification and historical context</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Accessible:</strong> Affordable pricing and free tier for students and educators</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Future-Ready:</strong> AR capabilities coming soon for immersive experiences</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology</h2>
          <p className="text-lg text-gray-700">
            Our platform uses advanced computer vision and natural language processing to analyze artifacts and generate rich historical narratives. We've trained our models on extensive datasets of South Asian archaeological artifacts, ensuring accurate and culturally relevant information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;