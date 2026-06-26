import React from 'react';
import { Scale, CheckCircle, FileText, AlertTriangle, Ban, RefreshCw, Mail } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-10 h-10 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">Last updated: January 8, 2026</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-600">
          
          {/* Introduction */}
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Welcome to HeritageAI. These Terms of Service govern your use of our AI-powered artifact analysis platform. Please read them carefully before using our services.
          </p>

          {/* Section 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                1
              </div>
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-11">
              By accessing or using HeritageAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                2
              </div>
              <FileText className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Use of Service</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-3 leading-relaxed">You agree to use HeritageAI only for lawful purposes. You must:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Be at least 13 years old to use our services</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Provide accurate account information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Keep your login credentials secure</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Not upload illegal, harmful, or offensive content</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Not attempt to reverse-engineer our AI technology</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                3
              </div>
              <Scale className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Intellectual Property</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-3 leading-relaxed">Ownership and rights:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Your Content:</strong> You retain ownership of artifacts and images you upload</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Our Platform:</strong> HeritageAI, its AI models, and analysis results are our intellectual property</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>License:</strong> You grant us a limited license to process your uploads for analysis purposes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                4
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Disclaimer</h2>
            </div>
            <div className="ml-11 bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">
                AI analysis is for informational purposes only and should not replace professional appraisal or authentication. HeritageAI provides no guarantees regarding accuracy, authenticity assessments, or valuations. Use results at your own discretion.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                5
              </div>
              <Ban className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-11">
              HeritageAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability is limited to the amount you paid for our services in the past 12 months.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                6
              </div>
              <RefreshCw className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Termination</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-11">
              We reserve the right to suspend or terminate your account for violations of these terms. You may cancel your account at any time through your dashboard settings.
            </p>
          </div>

          {/* Section 7 - Contact */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                7
              </div>
              <Mail className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-3 leading-relaxed">
                Questions about these terms? Reach out to us:
              </p>
              <a 
                href="mailto:contact@heritageai.com" 
                className="text-gray-700 mb-3 leading-relaxed underline hover:text-amber-600 transition-colors"
              >
                contact@heritageai.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 my-8" />

          {/* Agreement Notice */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">
              By continuing to use HeritageAI, you acknowledge that you have read, understood, and agree to these Terms of Service.
            </p>
          </div>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
          >
            Back to Home
          </a>
        </div>

      </div>
    </div>
  );
};

export default TermsOfServicePage;