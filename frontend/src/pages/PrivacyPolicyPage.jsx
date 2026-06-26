import React from 'react';
import { Shield, Database, FileText, Users, Lock, UserCheck, Cookie, Globe, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: February 8, 2026</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-600">
          
          {/* Introduction */}
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            At HeritageAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          {/* Section 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                1
              </div>
              <Database className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="ml-11 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Name and email address</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Payment information for subscriptions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Profile information and preferences</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Artifact Data</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Images and photos of artifacts you upload</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Metadata and AI analysis results</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Device and browser information</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">IP address and usage patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                2
              </div>
              <FileText className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="ml-11">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Provide and improve our AI-powered artifact analysis services</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Process transactions and manage subscriptions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Train AI models using anonymized data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Send updates and support communications</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Detect and prevent security threats</p>
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
              <Users className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">How We Share Your Information</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-3">We do not sell your personal information. We may share data with:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Service Providers:</strong> Cloud hosting, payment processing, and analytics partners</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>AI Partners:</strong> Technology providers for AI analysis (encrypted and anonymized)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</p>
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
              <Shield className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Your Artifact Images</h2>
            </div>
            <div className="ml-11 bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Your images are stored securely and accessible only to you and our AI systems</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">We never share your artifact images publicly without permission</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">You can delete your images at any time from your dashboard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                5
              </div>
              <Lock className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="ml-11">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Encryption of data in transit and at rest</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Secure cloud storage with regular backups</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Regular security audits and updates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Limited access by authorized personnel only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                6
              </div>
              <UserCheck className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Your Rights and Choices</h2>
            </div>
            <div className="ml-11">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Access:</strong> Request a copy of your personal data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Correction:</strong> Update or correct your information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Deletion:</strong> Request deletion of your account and data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Opt-out:</strong> Unsubscribe from marketing communications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                7
              </div>
              <Cookie className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Cookies and Tracking</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-3">We use cookies to:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Remember your preferences and settings</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Analyze platform usage and improve features</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Provide personalized recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                8
              </div>
              <Globe className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">International Data Transfers</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-11">
              Your information may be transferred to and processed in countries other than Pakistan. We ensure appropriate safeguards are in place to protect your data.
            </p>
          </div>

          {/* Section 9 - Contact */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-lg font-bold text-sm flex-shrink-0">
                9
              </div>
              <Mail className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-3 leading-relaxed">
                Questions about this Privacy Policy? Contact us:
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
              By using HeritageAI, you acknowledge that you have read and understood this Privacy Policy.
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

export default PrivacyPolicyPage;