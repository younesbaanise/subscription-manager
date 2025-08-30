import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/AddSubscription';
import EditSubscription from './pages/EditSubscription';
import ForgetPassword from './pages/ForgetPassword';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Default route redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/add-subscription" 
                element={
                  <PrivateRoute>
                    <AddSubscription />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-subscription/:id" 
                element={
                  <PrivateRoute>
                    <EditSubscription />
                  </PrivateRoute>
                } 
              />
              
              {/* Catch all route - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;