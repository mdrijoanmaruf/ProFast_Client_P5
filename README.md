# ProFast - Fast & Reliable Parcel Delivery Service

A modern, responsive web application for parcel delivery services built with React and Vite.

## 🌐 Live Demo
**[Visit ProFast Live](https://profast.rijoan.com)**

## 📋 Overview
ProFast is a comprehensive parcel delivery platform that enables users to send, track, and manage their parcels with ease. The application features a modern dashboard, secure payment integration, real-time tracking capabilities, and a complete admin system for managing riders and assignments. Built with modern web technologies, ProFast provides both customers and administrators with powerful tools to handle delivery operations efficiently.

## ✨ Key Features

### 🚀 Core Features
- **Send Parcels**: Easy-to-use form for booking parcel deliveries
- **Track Parcels**: Real-time tracking with unique tracking numbers
- **Payment Integration**: Secure payment processing with Stripe
- **User Dashboard**: Comprehensive dashboard for managing parcels
- **Rider Management**: Admin functionality to assign riders to parcels
- **Assignment Tracking**: View and manage parcel-rider assignments
- **Authentication**: Secure user authentication with Firebase

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Consistent color scheme throughout the app
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

### 📱 Technical Features
- **React 18**: Latest React features and hooks
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing with protected routes
- **TanStack Query**: Efficient data fetching and caching
- **Axios**: HTTP client for API communications
- **Firebase**: Authentication and backend services
- **Admin Panel**: Role-based access control for administrative functions
- **Real-time Updates**: Dynamic data refresh and live status tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router Dom** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation

### Backend & Services
- **Firebase** - Authentication and backend services
- **Stripe** - Payment processing
- **MongoDB** - Database (via backend API)
- **Express.js** - Backend API server

### UI Components & Libraries
- **React Icons** - Icon library
- **AOS (Animate On Scroll)** - Scroll animations
- **SweetAlert2** - Beautiful alert dialogs
- **React Hot Toast** - Notification system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

## 🌟 Features Breakdown

### Authentication
- User registration and login
- Firebase authentication integration
- Protected routes and role-based access control
- Social login support
- Admin and user role management

### Parcel Management
- Create new parcel bookings
- View parcel history
- Track parcel status
- Cost calculation based on weight and distance
- Delivery priority settings (Standard, Express, Urgent)

### Rider Assignment System
- **Admin Dashboard**: Comprehensive rider management interface
- **Assign Riders**: Intelligent assignment of available riders to paid parcels
- **Assignment Tracking**: View all parcel-rider assignments with detailed information
- **Rider Status**: Monitor active riders and their availability
- **Real-time Updates**: Live status tracking for assignments and deliveries

### Payment System
- Stripe integration for secure payments
- Payment history tracking
- Invoice generation
- Multiple payment methods
- Secure payment status management

### Dashboard
- User-friendly dashboard interface
- Parcel statistics and analytics
- Quick actions and shortcuts
- Responsive design for all devices
- Role-based dashboard views (User/Admin)

### Admin Features
- **Rider Management**: Add, view, and manage delivery riders
- **Assignment Control**: Assign riders to unassigned paid parcels
- **Assignment Overview**: Comprehensive view of all parcel-rider assignments
- **User Role Management**: Promote users to admin status
- **System Analytics**: Monitor parcel volumes, rider performance, and delivery statistics
- **Rider Status Tracking**: View active, pending, and inactive riders
- **Advanced Filtering**: Search and filter parcels and assignments by multiple criteria

## 📱 Responsive Design
The application is fully responsive and tested on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Security Features
- JWT token-based authentication
- Role-based access control (Admin/User)
- Secure API endpoints with middleware protection
- Input validation and sanitization
- HTTPS encryption
- Firebase security rules
- Protected admin routes and functionality

## 🚀 Deployment
The application is deployed on:
- **Frontend**: Vercel/Netlify
- **Backend**: Vercel
- **Database**: MongoDB Atlas
- **CDN**: Firebase Storage

## 🛣️ Application Routes

### Public Routes
- `/` - Homepage with service overview
- `/login` - User authentication
- `/register` - User registration
- `/coverage` - Service coverage areas
- `/track` - Public parcel tracking
- `/about` - About the company

### Protected User Routes
- `/dashboard/myParcels` - User's parcel history
- `/dashboard/tracking` - Track user's parcels
- `/dashboard/payments` - Payment history
- `/sendParcel` - Create new parcel booking

### Admin Only Routes
- `/dashboard/activeRider` - Manage active riders
- `/dashboard/pendingRider` - Review pending rider applications
- `/dashboard/assign-rider` - Assign riders to parcels
- `/dashboard/assigned-parcels` - View all parcel assignments
- `/dashboard/makeAdmin` - User role management

## 📄 Documentation
- [Axios Implementation Guide](./Axios.md)
- [TanStack Query Notes](./TanStackQueryNote.md)
- [Stripe Payment Integration](./Stripe.md)
- [Admin Features Guide](./ADMIN.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)


## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- React team for the amazing library
- Vite team for the fast build tool
- Tailwind CSS for the utility-first approach
- Firebase for backend services
- Stripe for payment processing

---

**Made with by Rijoan Maruf**
