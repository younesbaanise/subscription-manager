import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSubscriptions } from '../contexts/SubscriptionContext';
import { toast } from 'react-hot-toast';

const SubscriptionCard = ({ subscription }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteSubscription, toggleSubscriptionStatus } = useSubscriptions();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  // Format price for display
  const formatPrice = (price) => {
    return `${Number(price).toFixed(2)} MAD`;
  };

  // Handle delete subscription
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteSubscription(subscription.id);
      toast.success('Subscription deleted successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to delete subscription.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle toggle active status
  const handleToggleStatus = async () => {
    try {
      await toggleSubscriptionStatus(subscription.id, !subscription.isActive);
      toast.success(`Subscription ${subscription.isActive ? 'deactivated' : 'activated'} successfully.`);
    } catch (error) {
      toast.error(error.message || 'Failed to update subscription status.');
    }
  };

  // Handle edit subscription
  const handleEdit = () => {
    navigate(`/edit-subscription/${subscription.id}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 flex flex-col h-full ${
      subscription.isActive ? 'border-green-500' : 'border-gray-400'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {subscription.serviceName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {subscription.category}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              subscription.isActive
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {subscription.isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatPrice(subscription.price)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Billing Cycle</p>
          <p className="text-sm font-medium text-gray-900">
            {subscription.billingCycle}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment Method</p>
          <p className="text-sm font-medium text-gray-900">
            {subscription.paymentMethod}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Next Renewal</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(subscription.renewalDate)}
          </p>
        </div>
      </div>

      <div className="mb-4 flex-grow">
        <p className="text-sm text-gray-500">Notes</p>
        <p className="text-sm text-gray-700">
          {subscription.notes ? subscription.notes : 'No notes provided'}
        </p>
      </div>

      <div className="flex justify-end space-x-2 mt-auto">
        <button
          onClick={handleEdit}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
