import React, { useState, useEffect } from 'react';
import { Star, Sparkles, History, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const ProfilePage = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const displayName = user?.user_metadata?.full_name || "Heritage Explorer";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {displayName[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Account Type</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-bold text-gray-900">
                    {user?.is_premium ? 'Premium' : 'Free'}
                  </p>
                  {!user?.is_premium && <Star className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Uploads Today</p>
                <p className="text-lg font-bold text-gray-900">
                  {user?.uploads_today || 0} / {user?.is_premium ? '∞' : '3'}
                </p>
              </div>
            </div>

            {!user?.is_premium && (
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-5 text-white mb-6 shadow-sm">
                <div className="absolute -right-2 -bottom-2 opacity-10">
                  <Star className="w-20 h-20" />
                </div>

                <div className="flex items-center space-x-4 relative z-10">
                  <div className="bg-white/20 p-2 rounded-md backdrop-blur-sm shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-0.5">
                        <h3 className="font-bold text-lg">HeritageAI Premium</h3>
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-full">
                          In Development
                        </span>
                      </div>
                      <p className="text-amber-50 text-xs max-w-sm">
                        Unlimited uploads and AR site tours are coming soon.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload History Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload History</h2>
            <History className="w-6 h-6 text-gray-400" />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-100 rounded flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.civilization}</h4>
                      <p className="text-sm text-gray-500">{item.era}</p>
                    </div>
                  </div>
                  <button className="text-amber-600 hover:text-amber-700">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No uploads yet</p>
              <button
                onClick={() => setCurrentPage('upload')}
                className="text-amber-600 font-semibold hover:text-amber-700"
              >
                Upload Your First Artifact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;