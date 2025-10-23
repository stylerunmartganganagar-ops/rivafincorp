import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const AdminAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user_metadata?.role === 'admin' || user?.email === 'admin@rivafincorp.com') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>
            You tried to access the admin panel. Only admin users are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you believe this is a mistake, please contact a workspace administrator.
          </p>
          <div className="flex gap-2">
            <Button variant="default" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            <Button variant="outline" onClick={() => navigate('/settings')}>Open Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
