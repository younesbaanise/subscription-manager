import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSubscriptions } from '../contexts/SubscriptionContext';
import { toast } from 'react-hot-toast';
import { FiEdit, FiArrowLeft, FiDollarSign, FiCalendar, FiCreditCard, FiFileText, FiCheck, FiX, FiSave } from 'react-icons/fi';

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

  // Calculate renewal date based on billing cycle
  const calculateRenewalDate = (billingCycle, customDate = null) => {
    if (customDate) {
      return customDate;
    }

    const now = new Date();
    const renewalDate = new Date(now);

    if (billingCycle === 'Monthly') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else if (billingCycle === 'Yearly') {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    // Format date for input field (YYYY-MM-DD)
    return renewalDate.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // If billing cycle changed, recalculate renewal date
      if (name === 'billingCycle') {
        newData.renewalDate = calculateRenewalDate(value);
      }

      return newData;
    });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Subscription</h1>
              <p className="text-gray-600 text-sm sm:text-base">Update your subscription details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl">
                <FiEdit className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
                <p className="text-gray-600 text-sm">Update the details of your subscription</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Netflix, Spotify, Adobe Creative Suite"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                  Price (MAD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Billing Cycle and Payment Method Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Cycle */}
              <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle <span className="text-red-500">*</span>
                </label>
                <select
                  id="billingCycle"
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select billing cycle</option>
                  {billingCycles.map(cycle => (
                    <option key={cycle} value={cycle}>
                      {cycle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Select payment method</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Renewal Date */}
            <div>
              <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 mb-2">
                Next Renewal Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="renewalDate"
                  name="renewalDate"
                  value={formData.renewalDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <FiCheck className="w-4 h-4 mr-1" />
                Leave empty to auto-calculate based on billing cycle
              </p>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Add any additional notes about this subscription..."
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-700">
                Active subscription
              </label>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FiX className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Update Subscription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubscription;
