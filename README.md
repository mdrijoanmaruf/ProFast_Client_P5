# ProFast - Fast & Reliable Parcel Delivery Service

A modern, responsive web application for parcel delivery services built with React and Vite.

## 🌐 Live Demo
**[Visit ProFast Live](https://profast.rijoan.com)**

## 📋 Overview
ProFast is a comprehensive parcel delivery platform that enables users to send, track, and manage their parcels with ease. The application features a modern dashboard, secure payment integration, and real-time tracking capabilities.

## ✨ Key Features

### 🚀 Core Features
- **Send Parcels**: Easy-to-use form for booking parcel deliveries
- **Track Parcels**: Real-time tracking with unique tracking numbers
- **Payment Integration**: Secure payment processing with Stripe
- **User Dashboard**: Comprehensive dashboard for managing parcels
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

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/profast.git
   cd profast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, and static files
├── components/      # Reusable UI components
├── contexts/        # React contexts (Auth, Theme, etc.)
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── routes/         # Route configurations
├── shared/         # Shared components (Header, Footer, etc.)
└── utils/          # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🌟 Features Breakdown

### Authentication
- User registration and login
- Firebase authentication integration
- Protected routes
- Social login support

### Parcel Management
- Create new parcel bookings
- View parcel history
- Track parcel status
- Cost calculation based on weight and distance

### Payment System
- Stripe integration for secure payments
- Payment history tracking
- Invoice generation
- Multiple payment methods

### Dashboard
- User-friendly dashboard interface
- Parcel statistics and analytics
- Quick actions and shortcuts
- Responsive design for all devices

## 📱 Responsive Design
The application is fully responsive and tested on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Security Features
- JWT token-based authentication
- Secure API endpoints
- Input validation and sanitization
- HTTPS encryption
- Firebase security rules

## 🚀 Deployment
The application is deployed on:
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Heroku
- **Database**: MongoDB Atlas
- **CDN**: Firebase Storage

## 📄 Documentation
- [Axios Implementation Guide](./Axios.md)
- [TanStack Query Notes](./TanStackQueryNote.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact
- **Website**: [profast.rijoan.com](https://profast.rijoan.com)
- **Email**: support@profast.com
- **Developer**: Rijoan Rahman

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- React team for the amazing library
- Vite team for the fast build tool
- Tailwind CSS for the utility-first approach
- Firebase for backend services
- Stripe for payment processing

---

**Made with ❤️ by Rijoan Rahman**
