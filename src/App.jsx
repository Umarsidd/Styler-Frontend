import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RBACProvider } from './context/RBACContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Services from './pages/Services';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import { Users, Stylers, Services as AdminServices, Appointments } from './pages/admin/AdminPages';

// Salon Pages
import SalonList from './pages/salons/SalonList';
import SalonDetails from './pages/salons/SalonDetails';

// Booking Pages
import BookingFlow from './pages/booking/BookingFlow';

// Payment Pages
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import MyAppointments from './pages/customer/MyAppointments';
import AppointmentDetails from './pages/customer/AppointmentDetails';

// Layout Component
const Layout = ({ children, showFooter = true, showNavbar = true }) => {
  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<Layout showFooter={false}><Login /></Layout>} />
        <Route path="/register" element={<Layout showFooter={false}><Login isRegisterMode={true} /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />

        {/* Salon Discovery Routes */}
        <Route path="/salons" element={<Layout><SalonList /></Layout>} />
        <Route path="/salons/:id" element={<Layout><SalonDetails /></Layout>} />

        {/* Booking Route - Protected for customers */}
        <Route
          path="/booking/:salonId"
          element={
            <ProtectedRoute role="customer">
              <Layout><BookingFlow /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Payment Routes */}
        <Route path="/payment/success" element={<Layout><PaymentSuccess /></Layout>} />
        <Route path="/payment/failed" element={<Layout><PaymentFailed /></Layout>} />

        {/* Customer Dashboard Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute role="customer">
              <Layout><CustomerDashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/appointments"
          element={
            <ProtectedRoute role="customer">
              <Layout><MyAppointments /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/appointments/:id"
          element={
            <ProtectedRoute role="customer">
              <Layout><AppointmentDetails /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Layout showFooter={false} showNavbar={false}><AdminLogin /></Layout>} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="superadmin" redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stylers"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Stylers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <AdminServices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner", "receptionist"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Access */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <RBACProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </RBACProvider>
    </AuthProvider>
  );
}

export default App;
