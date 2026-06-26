import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw new Error(error.message || 'Invalid login credentials');
      }
    } catch (error) {
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // Check if the error is due to existing user
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          throw new Error('You are already signed up. Please login instead.');
        }
        throw new Error(error.message || 'Signup failed');
      }

      // Check if user already exists (Supabase sometimes returns success even for existing users)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('You are already signed up. Please login instead.');
      }

      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              full_name: name,
              is_premium: false,
              uploads_today: 0
            }]);

          if (profileError) {
            console.error("Error creating profile:", profileError.message);
            throw new Error('Account created but profile setup failed. Please contact support.');
          }
          
          return {
            success: true,
            message: "Check your email for a confirmation link!",
            user: data.user
          };
        } catch (profileError) {
          // If profile creation fails, still return success since auth account was created
          console.error("Profile creation error:", profileError);
          return {
            success: true,
            message: "Account created! Please check your email for a confirmation link.",
            user: data.user
          };
        }
      }
    } catch (error) {
      // Handle network errors with user-friendly messages
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('ERR_INTERNET_DISCONNECTED')) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      // Handle CORS errors
      if (error.message.includes('CORS')) {
        throw new Error('Connection error. Please try again later or contact support.');
      }
      
      // Re-throw the error if it's already a user-friendly message
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message || 'Logout failed');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect. Please check your internet connection.');
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};