import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated and email verified
  useEffect(() => {
    if (user && user.emailVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if fields are empty
    if (!formData.email || !formData.password) {
      toast.error('Please enter valid data.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        toast.error('Please verify your email.');
        setLoading(false);
        return;
      }

      // Success - wait a moment for auth state to update
      toast.success('Login successful!');
      
      // Use setTimeout to ensure the auth state has time to update
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);

    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password.');
      } else if (error.code === 'auth/user-disabled') {
        toast.error('This account has been disabled.');
      } else {
        toast.error('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) {
      toast.error('No user found. Please sign up first.');
      return;
    }

    setResendLoading(true);

    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/forget-password')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </button>
          </div>

          {/* Resend verification button - show if user exists but email not verified */}
          {user && !user.emailVerified && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
