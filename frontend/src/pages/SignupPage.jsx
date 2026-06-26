import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, CheckCircle, XCircle, Mail, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ValidationItem = ({ isValid, text }) => (
  <div className="flex items-center gap-2 text-sm">
    {isValid ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-400" />
    )}
    <span className={isValid ? 'text-green-600' : 'text-gray-600'}>
      {text}
    </span>
  </div>
);

const SignupPage = ({ setCurrentPage }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const validatePassword = (pwd) => {
    const validation = {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(v => v === true);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    if (!validatePassword(password)) {
      setError('Please meet all password requirements');
      return;
    }

    try {
      const result = await signup(name, email, password);
      if (result && result.success) {
        setEmailSent(true);
        setCooldownTime(60); // Set 60 second cooldown after first email
      }
    } catch (err) {
      // Check for rate limit error
      if (err.message.includes('Email rate limit exceeded') || 
          err.message.includes('rate limit') ||
          err.message.includes('too many requests')) {
        // Don't set error message, just set cooldown - the cooldown warning will show instead
        setCooldownTime(60);
      } else {
        setError(err.message);
      }
    }
  };

  const handleResendEmail = async () => {
    if (cooldownTime > 0) {
      return; // Don't show error, button is already disabled
    }

    setIsResending(true);
    setError('');
    
    try {
      await signup(name, email, password);
      setCooldownTime(60); // Reset cooldown after resending
      // Show temporary success message
      setTimeout(() => {
        setIsResending(false);
      }, 2000);
    } catch (err) {
      if (err.message.includes('Email rate limit exceeded') || 
          err.message.includes('rate limit') ||
          err.message.includes('too many requests')) {
        // Just set cooldown, don't show error message
        setCooldownTime(60);
      } else {
        setError('Failed to resend email. Please try again later.');
      }
      setIsResending(false);
    }
  };

  const getEmailProvider = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const providers = {
      'gmail.com': { name: 'Gmail', url: 'https://mail.google.com' },
      'yahoo.com': { name: 'Yahoo Mail', url: 'https://mail.yahoo.com' },
      'outlook.com': { name: 'Outlook', url: 'https://outlook.live.com' },
      'hotmail.com': { name: 'Outlook', url: 'https://outlook.live.com' },
      'icloud.com': { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' },
    };
    return providers[domain] || { name: 'Email', url: null };
  };

  // Email Sent Success Screen
  if (emailSent) {
    const emailProvider = getEmailProvider(email);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          {/* Icon with animation */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mail className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
            <p className="text-gray-600">We've sent a verification link to</p>
            <p className="text-amber-600 font-semibold mt-1">{email}</p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Next Steps:
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 ml-7 list-decimal">
              <li>Open your email inbox</li>
              <li>Find the email from Heritage Explorer</li>
              <li>Click the verification link</li>
              <li>Come back and log in!</li>
            </ol>
          </div>

          {/* Quick action buttons */}
          <div className="space-y-3 mb-6">
            {emailProvider.url && (
              <a
                href={emailProvider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Open {emailProvider.name}
              </a>
            )}
            
            <button
              onClick={handleResendEmail}
              disabled={isResending || cooldownTime > 0}
              className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldownTime > 0 ? (
                <>
                  <Clock className="w-5 h-5" />
                  Wait {cooldownTime}s to Resend
                </>
              ) : (
                <>
                  <RefreshCw className={`w-5 h-5 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </>
              )}
            </button>
          </div>

          {/* ONLY show cooldown warning if there's a cooldown AND no other error */}
          {cooldownTime > 0 && !error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-800 text-sm font-medium">Please wait {cooldownTime} seconds</p>
                <p className="text-yellow-700 text-xs mt-1">
                  Too many attempts. This helps protect against spam.
                </p>
              </div>
            </div>
          )}

          {/* Help section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Didn't receive the email?</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
              <li>Check your spam or junk folder</li>
              <li>Make sure {email} is correct</li>
              <li>Wait a few minutes and check again</li>
              <li>The email may take up to 5 minutes to arrive</li>
            </ul>
          </div>

          {/* ONLY show error if there's an actual error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Back to signup link */}
          <button
            onClick={() => {
              setEmailSent(false);
              setCooldownTime(0);
              setError('');
            }}
            className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-amber-600 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Signup
          </button>

          {/* Login link */}
          <p className="text-center text-gray-600 mt-4 text-sm">
            Already verified?{' '}
            <button 
              onClick={() => setCurrentPage('login')} 
              className="text-amber-600 font-semibold hover:text-amber-700"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Regular Signup Form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Start your heritage exploration journey</p>
        </div>

        {/* ONLY show cooldown warning if cooldown is active AND no other error */}
        {cooldownTime > 0 && !error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Please wait {cooldownTime} seconds</p>
              <p className="text-yellow-700 text-sm mt-1">
                Too many signup attempts. This helps protect against spam.
              </p>
            </div>
          </div>
        )}

        {/* ONLY show error if there's an actual error AND no cooldown */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
              {error.includes('already signed up') && (
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-red-600 underline text-sm mt-1 hover:text-red-700"
                >
                  Go to login page
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
              <ValidationItem 
                isValid={passwordValidation.minLength} 
                text="At least 8 characters" 
              />
              <ValidationItem 
                isValid={passwordValidation.hasUpperCase} 
                text="One uppercase letter (A-Z)" 
              />
              <ValidationItem 
                isValid={passwordValidation.hasNumber} 
                text="One number (0-9)" 
              />
              <ValidationItem 
                isValid={passwordValidation.hasSpecialChar} 
                text="One special character (!@#$%^&*)" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!Object.values(passwordValidation).every(v => v === true) || cooldownTime > 0}
          >
            {cooldownTime > 0 ? `Wait ${cooldownTime}s` : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => setCurrentPage('login')} className="text-amber-600 font-semibold hover:text-amber-700">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;