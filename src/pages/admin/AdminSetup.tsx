import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminSetup() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Admin Setup Required</CardTitle>
                <CardDescription>
                  Your account is created, but it hasn’t been granted admin access yet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="text-sm text-muted-foreground">Your user id (copy this and send it in chat)</div>
                  <div className="font-mono text-sm break-all mt-2">{user?.id}</div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Send your admin email + the user id above here, and I’ll grant the admin role.
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link to="/">
                    <Button variant="outline">Back to site</Button>
                  </Link>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
