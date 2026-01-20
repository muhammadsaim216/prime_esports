import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";

export default function AuthPage() {
  // 1. Connect to the Auth Hook
  const auth = useAuth(); 
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    discord: ""
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Connect to the signUp function in useAuth
      const { error } = await auth.signUp(
          formData.email, 
          formData.password, 
          formData.username, 
          formData.discord
      );
      if (!error) setIsEmailSent(true);
      if (error) alert(error.message);
    } else {
      const { error } = await auth.signIn(formData.email, formData.password);
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  if (isEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-4">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <h2 className="text-2xl font-bold italic uppercase">Check Your Email</h2>
          <p className="text-muted-foreground text-sm">We sent a verification link to {formData.email}</p>
          <Button onClick={() => window.location.reload()} className="w-full">Back to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-card p-8 rounded-xl border">
        <h1 className="text-2xl font-black italic uppercase text-center">{isSignUp ? "Register" : "Login"}</h1>
        
        {isSignUp && (
          <Input id="username" placeholder="Username" onChange={handleChange} required />
        )}
        
        <Input id="email" type="email" placeholder="Email" onChange={handleChange} required />
        <Input id="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        {isSignUp && (
          <Input id="discord" placeholder="Discord (User#0000)" onChange={handleChange} />
        )}

        <Button type="submit" className="w-full font-bold italic uppercase" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In")}
        </Button>

        <p className="text-center text-sm text-muted-foreground cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Login" : "New here? Create account"}
        </p>
      </form>
    </div>
  );
}