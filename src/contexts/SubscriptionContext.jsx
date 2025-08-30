import { createContext, useContext, useState, useEffect } from 'react';
import { ref, push, set, remove, get, serverTimestamp, onValue, off } from 'firebase/database';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load subscriptions for authenticated user with real-time updates
  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const subscriptionsRef = ref(db, `subscriptions/${user.uid}`);
    
    // Set up real-time listener
    const unsubscribe = onValue(subscriptionsRef, (snapshot) => {
      try {
        const subscriptionsData = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            subscriptionsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
        }
        
        // Sort by createdAt timestamp (newest first)
        subscriptionsData.sort((a, b) => {
          const aTime = a.createdAt || 0;
          const bTime = b.createdAt || 0;
          return bTime - aTime;
        });
        
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error('Error processing subscriptions data:', error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error loading subscriptions:', error);
      if (error.message.includes('permission-denied')) {
        console.error('Access denied. Please check your authentication.');
      } else if (error.message.includes('Index not defined')) {
        console.error('Database configuration error. Please contact support.');
      } else {
        console.error('Failed to load subscriptions. Please try again.');
      }
      setLoading(false);
    });

    // Cleanup function to remove listener when component unmounts or user changes
    return () => {
      off(subscriptionsRef, 'value', unsubscribe);
    };
  }, [user]);

  // Calculate renewal date based on billing cycle
  const calculateRenewalDate = (billingCycle, customDate = null) => {
    if (customDate) {
      return new Date(customDate).getTime();
    }

    const now = new Date();
    const renewalDate = new Date(now);

    if (billingCycle === 'Monthly') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else if (billingCycle === 'Yearly') {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    return renewalDate.getTime();
  };

  // Validate subscription data
  const validateSubscription = (subscriptionData) => {
    if (!subscriptionData.serviceName || subscriptionData.serviceName.trim() === '') {
      throw new Error('Service name is required.');
    }

    if (!subscriptionData.category) {
      throw new Error('Category is required.');
    }

    if (!subscriptionData.price || subscriptionData.price <= 0) {
      throw new Error('Price must be greater than 0.');
    }

    if (!subscriptionData.billingCycle) {
      throw new Error('Billing cycle is required.');
    }

    if (!subscriptionData.paymentMethod) {
      throw new Error('Payment method is required.');
    }
  };

  // Add new subscription
  const addSubscription = async (subscriptionData) => {
    if (!user) {
      throw new Error('You must be logged in to add subscriptions.');
    }

    try {
      validateSubscription(subscriptionData);

      const newSubscription = {
        serviceName: subscriptionData.serviceName.trim(),
        category: subscriptionData.category,
        price: Number(subscriptionData.price),
        billingCycle: subscriptionData.billingCycle,
        renewalDate: calculateRenewalDate(subscriptionData.billingCycle, subscriptionData.renewalDate),
        paymentMethod: subscriptionData.paymentMethod,
        notes: subscriptionData.notes?.trim() || '',
        isActive: subscriptionData.isActive !== undefined ? subscriptionData.isActive : true,
        createdAt: serverTimestamp()
      };

      const subscriptionsRef = ref(db, `subscriptions/${user.uid}`);
      const newSubscriptionRef = push(subscriptionsRef);
      await set(newSubscriptionRef, newSubscription);

      return newSubscriptionRef.key;
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  };

  // Update existing subscription
  const updateSubscription = async (subscriptionId, subscriptionData) => {
    if (!user) {
      throw new Error('You must be logged in to update subscriptions.');
    }

    if (!subscriptionId) {
      throw new Error('Subscription ID is required.');
    }

    try {
      validateSubscription(subscriptionData);

      const updatedSubscription = {
        serviceName: subscriptionData.serviceName.trim(),
        category: subscriptionData.category,
        price: Number(subscriptionData.price),
        billingCycle: subscriptionData.billingCycle,
        renewalDate: calculateRenewalDate(subscriptionData.billingCycle, subscriptionData.renewalDate),
        paymentMethod: subscriptionData.paymentMethod,
        notes: subscriptionData.notes?.trim() || '',
        isActive: subscriptionData.isActive !== undefined ? subscriptionData.isActive : true
      };

      const subscriptionRef = ref(db, `subscriptions/${user.uid}/${subscriptionId}`);
      await set(subscriptionRef, updatedSubscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  // Delete subscription
  const deleteSubscription = async (subscriptionId) => {
    if (!user) {
      throw new Error('You must be logged in to delete subscriptions.');
    }

    if (!subscriptionId) {
      throw new Error('Subscription ID is required.');
    }

    try {
      const subscriptionRef = ref(db, `subscriptions/${user.uid}/${subscriptionId}`);
      await remove(subscriptionRef);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw new Error('Failed to delete subscription. Please try again.');
    }
  };

  // Get single subscription by ID
  const getSubscription = async (subscriptionId) => {
    if (!user) {
      throw new Error('You must be logged in to view subscriptions.');
    }

    if (!subscriptionId) {
      throw new Error('Subscription ID is required.');
    }

    try {
      const subscriptionRef = ref(db, `subscriptions/${user.uid}/${subscriptionId}`);
      const snapshot = await get(subscriptionRef);
      
      if (!snapshot.exists()) {
        throw new Error('Subscription not found.');
      }

      return {
        id: snapshot.key,
        ...snapshot.val()
      };
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  };

  // Toggle subscription active status
  const toggleSubscriptionStatus = async (subscriptionId, isActive) => {
    if (!user) {
      throw new Error('You must be logged in to update subscriptions.');
    }

    if (!subscriptionId) {
      throw new Error('Subscription ID is required.');
    }

    try {
      const subscriptionRef = ref(db, `subscriptions/${user.uid}/${subscriptionId}/isActive`);
      await set(subscriptionRef, isActive);
    } catch (error) {
      console.error('Error toggling subscription status:', error);
      throw new Error('Failed to update subscription status. Please try again.');
    }
  };

  const value = {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
    toggleSubscriptionStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
