import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { GarageProvider } from './lib/garageContext';

import Layout from './components/Layout';
import HomeWrapper from './pages/HomeWrapper';
import Garage from './pages/Garage';
import VehicleProfile from './pages/VehicleProfile';
import Market from './pages/Market';
import Mechanic from './pages/Mechanic';
import Admin from './pages/Admin';
import CommandCenter from './pages/CommandCenter';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <GarageProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/garage/:id" element={<VehicleProfile />} />
          <Route path="/market" element={<Market />} />
          <Route path="/mechanic" element={<Mechanic />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/command-center" element={<CommandCenter />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </GarageProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;