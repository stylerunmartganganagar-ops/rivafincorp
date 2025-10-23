import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { ShieldCheck, Wallet, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, {
          full_name: name,
          phone: phone,
          company: company,
        });
        if (error) {
          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration successful",
            description: "Please check your email to verify your account.",
          });
          // Stay on the page or navigate as needed
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 p-6">
        <div className="hidden md:flex flex-col justify-center">
          <div className="rounded-xl overflow-hidden border">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop"
              alt="Analytics"
              className="w-full h-72 object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">YES Bank Authorized</div>
                <div className="text-sm text-muted-foreground">Trusted acquiring and secure infrastructure.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Instant Settlements</div>
                <div className="text-sm text-muted-foreground">Same-day and on-demand settlement options.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium">0% UPI MDR</div>
                <div className="text-sm text-muted-foreground">High success rates with UPI intent flows.</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto md:ml-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {mode === 'login' ? 'Login to Rivafincorp' : 'Create your Rivafincorp account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 90000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
              </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground mt-4">
              {mode === 'login' ? (
                <span>
                  New here?{' '}
                  <button className="underline" onClick={() => setMode('register')}>Create an account</button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button className="underline" onClick={() => setMode('login')}>Login</button>
                </span>
              )}
            </div>
          </CardContent>
      </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
