import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Dashboard router - redirects to role-specific dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading, user } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    if (!profile) {
      // If no profile after auth loaded, wait max 3s then go home
      const timeout = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timeout);
    }

    // Route to role-specific dashboard
    switch (profile.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'restaurant':
        navigate('/restaurant');
        break;
      case 'rider':
        navigate('/rider');
        break;
      case 'taxi':
        navigate('/taxi');
        break;
      case 'hotel':
        navigate('/hotel');
        break;
      case 'passenger':
      default:
        navigate('/');
        break;
    }
  }, [profile, isLoading, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
