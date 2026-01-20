import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", discord: "", terms: false });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        description: "Please make sure your passwords match.",
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.terms) {
      toast({ 
        title: "Terms required", 
        description: "Please accept the terms and conditions.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(
      formData.email, 
      formData.password, 
      formData.username,
      formData.discord || undefined
    );
    
    if (!error) {
      navigate("/");
    }
    
    setLoading(false);
  };

  return (
    <Layout>
      <section className="flex min-h-[calc(100vh-200px)] items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-xl font-bold text-primary-foreground">P</span>
            </div>
            <CardTitle className="font-display text-2xl">Create Account</CardTitle>
            <CardDescription>Join Prime Esports today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord">Discord Tag (Optional)</Label>
                <Input id="discord" placeholder="username#0000" value={formData.discord} onChange={(e) => setFormData({ ...formData, discord: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })} />
                <Label htmlFor="terms" className="text-sm leading-relaxed">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></Label>
              </div>
              <Button type="submit" className="w-full" disabled={!formData.terms || loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}