import React, { useState } from 'react';
import { MapPin, Clock, Sparkles, Upload, Lock } from 'lucide-react';

export default function TourPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [customQuery, setCustomQuery] = useState('');

  const presets = [
    {
      id: 'taxila',
      title: 'One Day Tour to Taxila',
      desc: 'Explore Jaulian, Sirkap, and the Taxila Museum with direct transit routes.',
      days: 1
    },
    {
      id: 'unesco',
      title: '3-Day Pakistan UNESCO Tour',
      desc: 'A comprehensive, verified route through 6 legendary heritage landmarks.',
      days: 3
    },
  ];

  const handlePlanTour = async (inputPrompt) => {
    if (!inputPrompt.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setItinerary(null);

    // Sequence stream updates to show the multi-agent execution pipeline
    setAgentStatus('🕵️ Guardrail Node evaluating intent verification rules...');
    await new Promise(r => setTimeout(r, 800));

    // Simple frontend optimization check for rapid user blocking
    const forbiddenKeywords = ['code', 'hack', 'script', 'programming', 'math', 'write an essay', 'ignore previous'];
    if (forbiddenKeywords.some(kw => inputPrompt.toLowerCase().includes(kw))) {
      setErrorMsg('I am a smart tour planner assistant and cannot reply to anything else as my committee profs will check using robust examples.');
      setLoading(false);
      return;
    }

    setAgentStatus('🗺️ Planner Agent organizing optimal heritage sites...');
    await new Promise(r => setTimeout(r, 800));

    setAgentStatus('🌐 Validator Node processing real-time News API travel warnings...');

    try {
      // FIX: Use VITE_API_BASE_URL from environment variables for production
      const BASE_URL = "https://heritageai-cnn1.onrender.com";

      const response = await fetch(`${baseUrl}/api/planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: inputPrompt }),
      });

      if (!response.ok) throw new Error(`Network returned code: ${response.status}`);
      const data = await response.json();

      if (data.status === 'guardrail_blocked') {
        setErrorMsg(data.message);
      } else if (data.status === 'success') {
        setItinerary(data.itinerary);
      } else {
        setErrorMsg('An unexpected node evaluation fault occurred.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to reach backend execution layer. Please check console for API path errors.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header Elements */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Agentic Tour Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate verifiable, multi-day historical itineraries managed securely through deterministic guardrails.
          </p>
        </div>

        {/* Workspace Layout Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Controls Panel */}
          <div className="md:col-span-5 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" /> Configuration Parameters
            </h2>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Select Demonstration Template</label>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setCustomQuery(preset.title);
                    handlePlanTour(preset.title);
                  }}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50/30 transition group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="font-bold text-gray-900 group-hover:text-amber-700 transition">{preset.title}</span>
                    <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 border border-amber-100">
                      <Clock className="w-3 h-3" /> {preset.days} Day
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{preset.desc}</p>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Custom Itinerary Script Input</label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Ex: Formulate a 2 day educational expedition exploring Lahore Fort & local monuments with a slow family pace..."
                className="w-full p-3 h-28 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none mb-3 text-gray-800"
              />
              <button
                type="button"
                onClick={() => handlePlanTour(customQuery)}
                disabled={loading}
                className="w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition shadow-sm disabled:opacity-50"
              >
                Assemble Agentic Plan
              </button>
            </div>
          </div>

          {/* Results Render Area */}
          <div className="md:col-span-7 bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[420px] flex flex-col justify-center">

            {!loading && !itinerary && !errorMsg && (
              <div className="text-center py-12 px-4 max-w-sm mx-auto">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-700 text-base mb-1">Execution Pipeline Idle</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Select a standard preset option or dispatch an out-of-scope query to evaluate system guardrails.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-amber-800 font-medium animate-pulse text-sm tracking-wide">{agentStatus}</p>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto shadow-sm">
                <Lock className="w-10 h-10 text-red-600 mx-auto mb-3" />
                <h4 className="font-bold text-red-900 text-base mb-1">System Guardrail Tripped</h4>
                <p className="text-red-800 font-medium text-xs leading-relaxed tracking-normal">{errorMsg}</p>
              </div>
            )}

            {itinerary && (
              <div className="space-y-6 w-full animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b pb-3 border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span>Agent Chain Complete: Verified Route Validated</span>
                </div>

                {itinerary.map((dayData, idx) => (
                  <div key={idx} className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                      {dayData.day}
                    </h3>

                    <div className="relative border-l-2 border-amber-200 pl-5 ml-2 space-y-6">
                      {dayData.activities.map((act, actIdx) => (
                        <div key={actIdx} className="relative">
                          <div className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-white ring-4 ring-amber-100"></div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 w-max shrink-0">
                              {act.time}
                            </span>
                            <h4 className="font-bold text-gray-900 text-sm">{act.location}</h4>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{act.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}