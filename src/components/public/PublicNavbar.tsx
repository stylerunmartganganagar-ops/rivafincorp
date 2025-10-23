import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img
            src="/riva-logo-png_seeklogo-437465-removebg-preview.png"
            alt="Riva Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="font-bold text-xl">Rivafincorp</span>
          <Badge variant="outline" className="ml-2">Payment Gateway • Since 2019</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
          <Button variant="ghost" onClick={() => navigate("/about")}>About</Button>
          <Button variant="ghost" onClick={() => navigate("/contact")}>Contact</Button>
          <Button variant="ghost" onClick={() => navigate("/important")}>Important</Button>
          {user && (
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          )}
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>Login</Button>
              <Button onClick={() => navigate("/auth")}>Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
