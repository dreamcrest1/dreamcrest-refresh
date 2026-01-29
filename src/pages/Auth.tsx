import { useMemo, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectUrl = useMemo(() => `${window.location.origin}/`, []);

  if (!loading && user) {
    // If already logged in, head to admin.
    setTimeout(() => navigate("/admin", { replace: true }), 0);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0]?.message ?? "Invalid inputs",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast({ title: "Logged in", description: "Redirecting to admin…" });
        navigate("/admin", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "You can now log in. If email confirmation is enabled, confirm your email first.",
        });
        setMode("login");
      }
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>{mode === "login" ? "Admin Login" : "Create Admin Account"}</CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in to manage products and content."
                    : "Create an account, then you’ll be granted admin access."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Please wait…" : mode === "login" ? "Login" : "Sign up"}
                  </Button>

                  <div className="text-sm text-muted-foreground text-center">
                    {mode === "login" ? (
                      <button
                        type="button"
                        className="hover:text-primary transition-colors"
                        onClick={() => setMode("signup")}
                      >
                        Need an account? Sign up
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="hover:text-primary transition-colors"
                        onClick={() => setMode("login")}
                      >
                        Already have an account? Login
                      </button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
