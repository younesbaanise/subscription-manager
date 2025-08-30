import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSubscriptions } from '../contexts/SubscriptionContext';
import { toast } from 'react-hot-toast';

const EditSubscription = () => {
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    billingCycle: '',
    renewalDate: '',
    paymentMethod: '',
    notes: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { updateSubscription, getSubscription } = useSubscriptions();
  const navigate = useNavigate();
  const { id } = useParams();

  const categories = [
    'Entertainment',
    'Productivity / Software',
    'Fitness & Health',
    'Education / Learning',
    'Gaming',
    'Utilities / Services',
    'Other'
  ];

  const billingCycles = ['Monthly', 'Yearly'];
  const paymentMethods = ['Card', 'Cash', 'Bank Transfer'];

  // Load subscription data on component mount
  useEffect(() => {
    const loadSubscription = async () => {
      if (!id) {
        toast.error('Subscription ID is required.');
        navigate('/dashboard');
        return;
      }

      try {
        setInitialLoading(true);
        const subscription = await getSubscription(id);
        
        // Format the renewal date for the date input
        const renewalDate = subscription.renewalDate 
          ? new Date(subscription.renewalDate).toISOString().split('T')[0]
          : '';

        setFormData({
          serviceName: subscription.serviceName || '',
          category: subscription.category || '',
          price: subscription.price?.toString() || '',
          billingCycle: subscription.billingCycle || '',
          renewalDate: renewalDate,
          paymentMethod: subscription.paymentMethod || '',
          notes: subscription.notes || '',
          isActive: subscription.isActive !== undefined ? subscription.isActive : true
        });
      } catch (error) {
        toast.error(error.message || 'Failed to load subscription.');
        navigate('/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };

    loadSubscription();
  }, [id, getSubscription, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;

    setLoading(true);
    try {
      await updateSubscription(id, formData);
      toast.success('Subscription updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error) {
      toast.error(error.message || 'Failed to update subscription.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Subscription
            </h1>
            <p className="text-gray-600">
              Update the details of your subscription service.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Netflix, Spotify, Adobe Creative Suite"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>

            {/* Billing Cycle */}
            <div>
              <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-2">
                Billing Cycle *
              </label>
              <select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select billing cycle</option>
                {billingCycles.map(cycle => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </div>

            {/* Renewal Date */}
            <div>
              <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 mb-2">
                Next Renewal Date
              </label>
              <input
                type="date"
                id="renewalDate"
                name="renewalDate"
                value={formData.renewalDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to auto-calculate based on billing cycle
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select payment method</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any additional notes about this subscription..."
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active subscription
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Subscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubscription;
