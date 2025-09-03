import { useAuth } from "../contexts/AuthContext";
import { useSubscriptions } from "../contexts/SubscriptionContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import SubscriptionCard from "../components/SubscriptionCard";
import { FiPlus, FiLogOut, FiFilter, FiX, FiTrendingUp, FiDollarSign, FiCalendar, FiUser } from "react-icons/fi";
import { FaMoneyBill } from "react-icons/fa";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { subscriptions, loading } = useSubscriptions();
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    billingCycle: '',
    paymentMethod: '',
    status: ''
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const handleAddSubscription = () => {
    navigate("/add-subscription");
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      billingCycle: '',
      paymentMethod: '',
      status: ''
    });
  };

  // Filter subscriptions based on current filters
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(subscription => {
      // Category filter
      if (filters.category && subscription.category !== filters.category) {
        return false;
      }
      
      // Billing cycle filter
      if (filters.billingCycle && subscription.billingCycle !== filters.billingCycle) {
        return false;
      }
      
      // Payment method filter
      if (filters.paymentMethod && subscription.paymentMethod !== filters.paymentMethod) {
        return false;
      }
      
      // Status filter
      if (filters.status) {
        const isActive = subscription.isActive;
        if (filters.status === 'active' && !isActive) {
          return false;
        }
        if (filters.status === 'inactive' && isActive) {
          return false;
        }
      }
      
      return true;
    });
  }, [subscriptions, filters]);

  // Calculate total monthly cost (only for filtered active subscriptions)
  const totalMonthlyCost = filteredSubscriptions
    .filter(sub => sub.isActive)
    .reduce((total, sub) => {
      if (sub.billingCycle === 'Monthly') {
        return total + sub.price;
      } else if (sub.billingCycle === 'Yearly') {
        return total + (sub.price / 12);
      }
      return total;
    }, 0);

  // Calculate total yearly cost (only for filtered active subscriptions)
  const totalYearlyCost = filteredSubscriptions
    .filter(sub => sub.isActive)
    .reduce((total, sub) => {
      if (sub.billingCycle === 'Monthly') {
        return total + (sub.price * 12);
      } else if (sub.billingCycle === 'Yearly') {
        return total + sub.price;
      }
      return total;
    }, 0);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl flex-shrink-0">
                <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
                <p className="text-gray-600 flex items-center text-sm sm:text-base">
                  <FiUser className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleAddSubscription}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none justify-center cursor-pointer"
              >
                <FiPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Subscription</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none justify-center cursor-pointer"
              >
                <FiLogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{filteredSubscriptions.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{totalMonthlyCost.toFixed(2)} MAD</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaMoneyBill className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yearly Cost</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalYearlyCost.toFixed(2)} MAD</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4 mr-1" />
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">All Categories</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity / Software">Productivity / Software</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Education / Learning">Education / Learning</option>
                <option value="Gaming">Gaming</option>
                <option value="Utilities / Services">Utilities / Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Billing Cycle Filter */}
            <div>
              <label htmlFor="billing-cycle-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Billing Cycle
              </label>
              <select
                id="billing-cycle-filter"
                value={filters.billingCycle}
                onChange={(e) => handleFilterChange('billingCycle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">All Billing Cycles</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label htmlFor="payment-method-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                id="payment-method-filter"
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">All Payment Methods</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Subscriptions</h2>
            {filteredSubscriptions.length > 0 && (
              <p className="text-sm text-gray-600">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </p>
            )}
          </div>
          
          {filteredSubscriptions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {subscriptions.length === 0 ? 'No subscriptions yet' : 'No subscriptions match your filters'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {subscriptions.length === 0 
                  ? 'Start tracking your subscriptions to manage your expenses better and never miss a renewal again.'
                  : 'Try adjusting your filters to see more results.'
                }
              </p>
              <button
                onClick={subscriptions.length === 0 ? handleAddSubscription : clearFilters}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                {subscriptions.length === 0 ? 'Add Your First Subscription' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
