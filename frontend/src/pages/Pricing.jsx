// import React from 'react';

// const PricingPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
//       <h2 className="text-4xl font-bold text-gray-900">Coming Soon <br></br>Stay tuned!</h2>
//     </div>
//   );
// };

// export default PricingPage;


import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: "Explorer",
      description: "For individuals and small teams automating their first tasks",
      monthlyPrice: 0,
      yearlyPrice: 0,
      apiCalls: 5,
      features: [
        "5 artifact identifications/month",
        "Basic artifact information",
        "Access to blog content",
        "Community forum access"
      ],
      highlighted: false,
      cta: "Current Plan",
      badge: null
    },
    {
      name: "Researcher",
      description: "For students and independent researchers",
      monthlyPrice: 15,
      yearlyPrice: 144,
      apiCalls: 100,
      features: [
        "100 identifications/month",
        "Detailed artifact analysis",
        "Historical context & provenance",
        "Advanced AI analysis",
        "3D artifact modeling",
        "Save and organize collections",
        "Export reports (PDF/CSV)"
      ],
      highlighted: true,
      cta: "Get Started",
      badge: "POPULAR"
    },
    {
      name: "Institution",
      description: "For museums, universities, and organizations at scale",
      monthlyPrice: 99,
      yearlyPrice: 950,
      apiCalls: "∞",
      features: [
        "Unlimited identifications",
        "Batch processing (50 items)",
        "API access for integration",
        "Team collaboration tools",
        "Custom AI training",
        "White-label options",
        "Dedicated account manager"
      ],
      highlighted: false,
      cta: "Contact Sales",
      badge: null
    },
    {
      name: "Enterprise",
      description: "For large organizations automating complex QA workflows at scale",
      monthlyPrice: null,
      yearlyPrice: null,
      apiCalls: "Custom",
      features: [
        "Everything in Institution, plus:",
        "Dedicated infrastructure",
        "Custom integrations and hosting",
        "SLA guarantees",
        "On-premise deployment",
        "Advanced security features"
      ],
      highlighted: false,
      cta: "Get Started",
      badge: null
    }
  ];

  const getPrice = (plan) => {
    if (plan.monthlyPrice === null) return "Custom";
    if (plan.monthlyPrice === 0) return "Free";
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return `$${price}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Heritage Journey
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            Unlock the secrets of South Asian heritage with AI-powered artifact identification
          </p>

          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md border border-amber-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-md font-medium transition-all text-sm ${
                billingCycle === 'monthly'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-md font-medium transition-all text-sm ${
                billingCycle === 'yearly'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="text-xs ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 transition-all hover:scale-[1.02] shadow-lg ${
                plan.highlighted
                  ? 'border-2 border-amber-500 shadow-2xl shadow-amber-500/20'
                  : 'border border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 leading-snug min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPrice(plan)}
                  </span>
                  {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                    <span className="text-gray-600 ml-2 text-sm">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
              </div>

              <button
                className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all mb-5 text-sm ${
                  plan.highlighted
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/30'
                    : index === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
                disabled={index === 0}
              >
                {plan.cta}
              </button>

              <div className="border-t border-gray-200 mb-4"></div>

              <div className="text-center mb-4 py-2">
                <div className="text-2xl font-bold text-amber-600">
                  {plan.apiCalls}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {typeof plan.apiCalls === 'number' 
                    ? 'IDs per month'
                    : plan.apiCalls === "∞"
                    ? 'identifications'
                    : 'volume'
                  }
                </div>
              </div>

              <div className="space-y-2.5">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start space-x-2"
                  >
                    <Check className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-white border border-amber-200 rounded-2xl p-8 max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-700 mb-5">
            Get in touch with our team to discuss enterprise pricing and custom integrations for your organization.
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-20 py-3 rounded-lg font-bold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30">
            <a 
              href="mailto:contacts@heritageai.com"
              className="inline-block">
             Contact Us   
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
