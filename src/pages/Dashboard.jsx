import { useAuth } from "../contexts/AuthContext";
import { useSubscriptions } from "../contexts/SubscriptionContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import SubscriptionCard from "../components/SubscriptionCard";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddSubscription}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Subscription
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Subscriptions</h3>
            <p className="text-3xl font-bold text-indigo-600">{filteredSubscriptions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Cost</h3>
            <p className="text-3xl font-bold text-green-600">{totalMonthlyCost.toFixed(2)} MAD</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Yearly Cost</h3>
            <p className="text-3xl font-bold text-blue-600">{totalYearlyCost.toFixed(2)} MAD</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Filters</h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear All Filters
            </button>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Subscriptions</h2>
          
          {filteredSubscriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {subscriptions.length === 0 ? 'No subscriptions yet' : 'No subscriptions match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {subscriptions.length === 0 
                  ? 'Start tracking your subscriptions to manage your expenses better.'
                  : 'Try adjusting your filters to see more results.'
                }
              </p>
              <button
                onClick={subscriptions.length === 0 ? handleAddSubscription : clearFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium"
              >
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
