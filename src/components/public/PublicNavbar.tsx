import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/riva-logo-png_seeklogo-437465-removebg-preview.png"
              alt="Riva Logo"
              className="h-6 w-6 md:h-8 md:w-8 object-contain"
            />
            <span className="font-bold text-lg md:text-xl">Rivafincorp</span>
            <Badge variant="outline" className="hidden sm:inline-flex ml-2">Payment Gateway • Since 2019</Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
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
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-6">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2 pb-4 border-b">
                  <img
                    src="/riva-logo-png_seeklogo-437465-removebg-preview.png"
                    alt="Riva Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-bold text-xl">Rivafincorp</span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/")}>
                    Home
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/about")}>
                    About
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/contact")}>
                    Contact
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/important")}>
                    Important
                  </Button>
                  {user && (
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/dashboard")}>
                      Dashboard
                    </Button>
                  )}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  {user ? (
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => handleNavigation("/auth")}>
                        Login
                      </Button>
                      <Button onClick={() => handleNavigation("/auth")}>
                        Register
                      </Button>
                    </>
                  )}
                </div>

                {/* Mobile Badge */}
                <div className="pt-2">
                  <Badge variant="outline" className="w-full justify-center">
                    Payment Gateway • Since 2019
                  </Badge>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
