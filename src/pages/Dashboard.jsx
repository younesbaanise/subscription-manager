import { useAuth } from "../contexts/AuthContext";
import { useSubscriptions } from "../contexts/SubscriptionContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import SubscriptionCard from "../components/SubscriptionCard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { subscriptions, loading } = useSubscriptions();
  const navigate = useNavigate();

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

  // Calculate total monthly cost
  const totalMonthlyCost = subscriptions
    .filter(sub => sub.isActive)
    .reduce((total, sub) => {
      if (sub.billingCycle === 'Monthly') {
        return total + sub.price;
      } else if (sub.billingCycle === 'Yearly') {
        return total + (sub.price / 12);
      }
      return total;
    }, 0);

  // Calculate total yearly cost
  const totalYearlyCost = subscriptions
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
            <p className="text-3xl font-bold text-indigo-600">{subscriptions.length}</p>
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

        {/* Subscriptions List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Subscriptions</h2>
          
          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your subscriptions to manage your expenses better.</p>
              <button
                onClick={handleAddSubscription}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium"
              >
                Add Your First Subscription
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
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
