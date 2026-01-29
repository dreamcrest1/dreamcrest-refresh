import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import AdminProducts from "@/pages/admin/AdminProducts";

type Tab = "products" | "site" | "blog" | "media";

export default function AdminShell() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="md:w-64">
              <Card className="bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant={tab === "products" ? "default" : "outline"} className="w-full" onClick={() => setTab("products")}>
                    Products
                  </Button>
                  <Button variant={tab === "site" ? "default" : "outline"} className="w-full" onClick={() => setTab("site")}>
                    Site Content
                  </Button>
                  <Button variant={tab === "blog" ? "default" : "outline"} className="w-full" onClick={() => setTab("blog")}>
                    Blog
                  </Button>
                  <Button variant={tab === "media" ? "default" : "outline"} className="w-full" onClick={() => setTab("media")}>
                    Media URLs
                  </Button>

                  <div className="pt-2 flex gap-2">
                    <Link to="/" className="flex-1">
                      <Button variant="outline" className="w-full">View site</Button>
                    </Link>
                    <Button variant="outline" onClick={() => signOut()}>
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <section className="flex-1">
              <Card className="bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>
                    {tab === "products" && "Products"}
                    {tab === "site" && "Site Content"}
                    {tab === "blog" && "Blog"}
                    {tab === "media" && "Media URLs"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tab === "products" ? (
                    <AdminProducts />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This section will be wired up next.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
