import { Link } from "react-router-dom";
import { Twitter, Youtube, Twitch, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Teams", href: "/teams" },
  { name: "Tryouts", href: "/tryouts" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
  { name: "Twitch", icon: Twitch, href: "https://twitch.tv" },
  { name: "Discord", icon: MessageCircle, href: "https://discord.com" },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-xl font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-display text-xl font-bold tracking-wider">
                PRIME <span className="text-primary">ESPORTS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Competing at the highest level across multiple titles. Join us on our journey to greatness.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Stay updated with our latest news and announcements.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Prime Esports. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with passion for competitive gaming.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
