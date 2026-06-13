import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Packages from './pages/Packages';
import DestinationsPage from './pages/DestinationsPage';
import AdminDashboard from './admin/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';
import StaffDashboard from './pages/StaffDashboard';
import Tours from './pages/Tours';
import SearchResults from './pages/SearchResults';
import TourDetails from './pages/TourDetails';
import HotelDetails from './pages/HotelDetails';
import BlogDetails from './pages/BlogDetails';
import CustomerDashboard from './pages/CustomerDashboard';
import AiBuilder from './pages/AiBuilder';
import Layout from './components/Layout';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './theme.css'; // Import global dark mode styles

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const StaffRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'staff') return <Navigate to="/" />;
  return children;
};

const RouteChangeListener = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) {
      setTimeout(() => {
        window.AOS.init();
        window.AOS.refresh();
      }, 100);
    }
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <RouteChangeListener />
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/ai-builder" element={<AiBuilder />} />
              <Route path="/tour-details/:id" element={<TourDetails />} />
              <Route path="/hotel-details/:id" element={<HotelDetails />} />
              <Route path="/blog-details" element={<BlogDetails />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/book/:id" element={<Booking />} />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/staff/*" element={
                <StaffRoute>
                  <StaffDashboard />
                </StaffRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
