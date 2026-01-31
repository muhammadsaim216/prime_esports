import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/NotificationBell";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Teams", href: "/teams" },
  { name: "Scrims", href: "/scrims" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, username, signOut } = useAuth();

  // Prioritize the custom username, fallback to email prefix if not set
  const displayIdentifier = username || user?.email?.split('@')[0] || 'Player';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-xl font-bold text-primary-foreground">P</span>
          </div>
          <span className="font-display text-xl font-bold tracking-wider uppercase">
            PRIME <span className="text-primary">ESPORTS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "nav-link text-sm uppercase tracking-wide",
                location.pathname === link.href && "text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{displayIdentifier}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-1">
                    Logged in as <span className="font-bold text-foreground">{displayIdentifier}</span>
                  </div>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-destructive cursor-pointer focus:bg-destructive/10"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "block py-2 text-sm uppercase tracking-wide transition-colors hover:text-primary",
                  location.pathname === link.href && "text-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t">
              {user ? (
                <>
                  <div className="px-2 pb-2 text-sm font-bold text-primary">
                    Hi, {displayIdentifier}
                  </div>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start text-destructive"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}