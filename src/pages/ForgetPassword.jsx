import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { FiMail, FiArrowLeft, FiShield, FiCheck, FiDollarSign, FiCalendar } from "react-icons/fi";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/login`;
      await sendPasswordResetEmail(auth, email, {
        url: redirectUrl,
      });

      toast.success(
        "If an account exists with this email, a password reset link has been sent. If you don't see it, check your spam folder."
      );

      // Clear the form
      setEmail("");
    } catch (error) {
      toast.success(
        "If an account exists with this email, a password reset link has been sent. If you don't see it, check your spam folder."
      );

      // Clear the form even on error for consistency
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <FiDollarSign className="w-5 h-5" />,
      title: "Track Your Spending",
      description: "Monitor all your subscription costs in one place"
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      title: "Never Miss Renewals",
      description: "Get notified before your subscriptions renew"
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      title: "Manage Easily",
      description: "Cancel, pause, or modify subscriptions effortlessly"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - App Introduction */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 p-12 flex-col justify-center">
          <div className="max-w-md mx-auto">
            {/* Simple Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Forgot Password?
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                No worries! We'll help you get back to managing your subscriptions
              </p>
            </div>

            {/* Simple Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="text-indigo-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Trust Indicators */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Why choose us?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Free to use</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Secure & private</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Works on all devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile App Introduction */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Forgot Password?
              </h1>
              <p className="text-gray-600 mb-6">
                No worries! We'll help you get back to managing your subscriptions
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                  <FiMail className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reset your password
                </h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Send Reset Link Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending reset link...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Send Reset Link
                    </div>
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Can't remember your email?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Create a new account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
