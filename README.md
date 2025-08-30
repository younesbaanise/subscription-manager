# 📱 Subscription Manager

A modern, responsive subscription management application built with React, Firebase, and Tailwind CSS. Track and manage all your subscriptions in one place with beautiful analytics and insights.

## ✨ Features

### 📊 Dashboard & Analytics
- **Subscription Overview**: Real-time summary of total subscriptions, monthly and yearly costs
- **Smart Filtering**: Filter by category, billing cycle, payment method, and status
- **Cost Analysis**: 
  - Monthly cost breakdown
  - Yearly cost projection
  - Active vs inactive subscriptions
- **Quick Actions**: Add new subscriptions directly from dashboard
- **Real-time Updates**: Instant synchronization across all devices

### 💳 Subscription Management
- **CRUD Operations**: Add, edit, delete, and view subscriptions
- **Smart Filtering**: Filter by category, billing cycle, payment method, and status
- **Categories**: Entertainment, Productivity, Fitness, Education, Gaming, Utilities, and more
- **Payment Methods**: Track different payment methods (Card, Cash, Bank Transfer)
- **Billing Cycles**: Monthly and yearly subscription tracking
- **Auto-renewal Dates**: Automatic calculation based on billing cycle
- **Status Management**: Active/inactive subscription toggle

### 🔐 Authentication & Security
- **Email/Password Authentication**: Secure login and registration
- **Google Sign-in**: One-click authentication with Google
- **Email Verification**: Required email verification for account security
- **Password Reset**: Secure password recovery flow
- **Protected Routes**: User-specific data access
- **Real-time Security**: Firebase Realtime Database with user-specific rules

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Touch-Friendly**: Intuitive mobile navigation and interactions
- **Consistent Layout**: Uniform card design and button positioning

### 🎨 User Experience
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages with react-hot-toast
- **Form Validation**: Real-time input validation
- **Smart Renewal Calculation**: Automatic renewal date calculation
- **Toast Notifications**: Success and error feedback
- **Intuitive Navigation**: Easy navigation between pages

### Dashboard Overview
- Subscription summary cards (Total, Monthly Cost, Yearly Cost)
- Filtering feature
- Subscription cards with consistent layout
- Quick add subscription button

### Subscription Management
- Subscription list with filtering
- Add/edit subscription forms
- Mobile-responsive design
- Real-time data synchronization

### Authentication Flow
- Login and signup pages with modern design
- Email verification process
- Password reset functionality
- Google authentication integration

## 🛠️ Tech Stack

### Frontend
- **React** - Modern React with hooks and functional components
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Icons** - Beautiful icon library for UI elements
- **React Hot Toast** - Toast notifications for user feedback

### Backend & Database
- **Firebase Authentication** - User authentication and management
- **Firebase Realtime Database** - Real-time data synchronization
- **Firebase Security Rules** - User-specific data access control

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/subscription-manager
   cd subscription-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   - Enable Authentication (Email/Password and Google Sign-in)
   - Create a Realtime Database
   - Set up security rules for the database

4. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

### Firebase Setup

1. **Authentication Setup**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Email/Password authentication
   - Enable Google Sign-in
   - Configure authorized domains

2. **Realtime Database Setup**
   - Go to Firebase Console → Realtime Database
   - Create database in test mode for development
   - Set up security rules for user-specific data access

3. **Database Security Rules**
   ```json
   {
     "rules": {
       "subscriptions": {
         "$uid": {
           ".read": "auth != null && auth.uid == $uid",
           ".write": "auth != null && auth.uid == $uid"
         }
       }
     }
   }
   ```

## 📖 Usage Guide

### 🔐 Authentication Flow

1. **Sign Up**
   - Click "Sign Up" on the login page
   - Enter your username, email, and password
   - Verify your email address (check spam folder)
   - Log in with your verified account

2. **Sign In**
   - Use email/password or Google Sign-in
   - Access your personalized dashboard

3. **Password Reset**
   - Click "Forgot Password?" on login page
   - Enter your email address
   - Follow the reset link in your email

### 📊 Dashboard Overview

The dashboard provides a comprehensive view of your subscription management:

- **Summary Cards**: Total subscriptions, monthly cost, and yearly cost
- **Smart Filtering**: Filter subscriptions by category, billing cycle, payment method, and status
- **Subscription Cards**: Clean, organized display of all subscriptions
- **Quick Actions**: Add new subscriptions directly from dashboard

### 💳 Managing Subscriptions

1. **Adding Subscriptions**
   - Click "Add Subscription" button
   - Enter service name and select category
   - Set price and billing cycle (Monthly/Yearly)
   - Choose payment method
   - Set renewal date (auto-calculated based on billing cycle)
   - Add optional notes
   - Toggle active status
   - Save the subscription

2. **Editing Subscriptions**
   - Click "Edit" button on any subscription card
   - Modify any subscription details
   - Update billing cycle (renewal date auto-recalculates)
   - Save changes

3. **Filtering Subscriptions**
   - Use the filter panel on the dashboard
   - Filter by category, billing cycle, payment method, or status
   - View filtered totals and subscription count
   - Clear all filters with one click

4. **Managing Subscription Status**
   - Toggle active/inactive status directly from subscription cards
   - Visual indicators show subscription status
   - Inactive subscriptions are excluded from cost calculations

5. **Deleting Subscriptions**
   - Click "Delete" button on any subscription card
   - Subscription is removed immediately (no confirmation required)

### 📱 Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Mobile Navigation**: Easy navigation between pages
- **Form Optimization**: Mobile-optimized input fields and buttons

### 🎨 Design Features

- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Consistent Layout**: Uniform card design and button positioning
- **Visual Hierarchy**: Clear information organization
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 Technical Features

### Real-time Data Synchronization
- **Firebase Realtime Database**: Instant updates across all devices
- **User-specific Data**: Secure, isolated data per user
- **Offline Support**: Basic offline functionality with Firebase

### Form Validation
- **Client-side Validation**: Real-time input validation
- **Required Fields**: Clear indication of required fields
- **Error Messages**: User-friendly error feedback
- **Smart Renewal Calculation**: Automatic date calculation

### Security
- **Firebase Authentication**: Secure user authentication
- **Database Rules**: User-specific data access
- **Protected Routes**: Secure page access
- **Email Verification**: Account security

---

**Built with ❤️ using React, Firebase, and Tailwind CSS**
