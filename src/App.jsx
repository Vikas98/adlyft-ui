import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import PublisherLayout from './components/layout/PublisherLayout';
import AdvertiserLayout from './components/layout/AdvertiserLayout';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPublishers from './pages/admin/Publishers';
import PublisherDetail from './pages/admin/PublisherDetail';
import AdminAdvertisers from './pages/admin/Advertisers';
import AdvertiserDetail from './pages/admin/AdvertiserDetail';
import AdApprovals from './pages/admin/AdApprovals';
import AllSlots from './pages/admin/AllSlots';
import AllCampaigns from './pages/admin/AllCampaigns';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';

// Publisher pages
import PublisherDashboard from './pages/publisher/Dashboard';
import MySlots from './pages/publisher/MySlots';
import CreateSlot from './pages/publisher/CreateSlot';
import EditSlot from './pages/publisher/EditSlot';
import RunningAds from './pages/publisher/RunningAds';
import PublisherAnalytics from './pages/publisher/Analytics';
import Earnings from './pages/publisher/Earnings';

// Advertiser pages
import AdvertiserDashboard from './pages/advertiser/Dashboard';
import Campaigns from './pages/advertiser/Campaigns';
import CreateCampaign from './pages/advertiser/CreateCampaign';
import CampaignDetail from './pages/advertiser/CampaignDetail';
import EditCampaign from './pages/advertiser/EditCampaign';
import MyAds from './pages/advertiser/MyAds';
import CreateAd from './pages/advertiser/CreateAd';
import AdvertiserPublishers from './pages/advertiser/Publishers';
import AdvertiserPublisherDetail from './pages/advertiser/PublisherDetail';
import AdvertiserAnalytics from './pages/advertiser/Analytics';
import Billing from './pages/advertiser/Billing';

// Route guards
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" size="lg" />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (user?.role !== role) return <Navigate to="/unauthorized" replace />;
  return children;
}

function ApprovedPublisherRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'publisher') return <Navigate to="/unauthorized" replace />;
  if (user?.status === 'pending') return <Navigate to="/pending-approval" replace />;
  return children;
}

function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" size="lg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'publisher') {
    return user?.status === 'pending'
      ? <Navigate to="/pending-approval" replace />
      : <Navigate to="/publisher" replace />;
  }
  if (user?.role === 'advertiser') return <Navigate to="/advertiser" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/pending-approval"
              element={
                <ProtectedRoute>
                  <PendingApproval />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute role="admin">
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="publishers" element={<AdminPublishers />} />
              <Route path="publishers/:id" element={<PublisherDetail />} />
              <Route path="advertisers" element={<AdminAdvertisers />} />
              <Route path="advertisers/:id" element={<AdvertiserDetail />} />
              <Route path="ad-approvals" element={<AdApprovals />} />
              <Route path="slots" element={<AllSlots />} />
              <Route path="campaigns" element={<AllCampaigns />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Publisher routes */}
            <Route
              path="/publisher"
              element={
                <ProtectedRoute>
                  <ApprovedPublisherRoute>
                    <PublisherLayout />
                  </ApprovedPublisherRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<PublisherDashboard />} />
              <Route path="slots" element={<MySlots />} />
              <Route path="slots/create" element={<CreateSlot />} />
              <Route path="slots/:id/edit" element={<EditSlot />} />
              <Route path="ads" element={<RunningAds />} />
              <Route path="analytics" element={<PublisherAnalytics />} />
              <Route path="earnings" element={<Earnings />} />
            </Route>

            {/* Advertiser routes */}
            <Route
              path="/advertiser"
              element={
                <ProtectedRoute>
                  <RoleRoute role="advertiser">
                    <AdvertiserLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdvertiserDashboard />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="campaigns/create" element={<CreateCampaign />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />
              <Route path="campaigns/:id/edit" element={<EditCampaign />} />
              <Route path="ads" element={<MyAds />} />
              <Route path="ads/create" element={<CreateAd />} />
              <Route path="publishers" element={<AdvertiserPublishers />} />
              <Route path="publishers/:id" element={<AdvertiserPublisherDetail />} />
              <Route path="analytics" element={<AdvertiserAnalytics />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
