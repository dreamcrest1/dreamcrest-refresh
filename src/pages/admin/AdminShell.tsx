import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminSiteContent from "@/pages/admin/AdminSiteContent";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminMediaLinks from "@/pages/admin/AdminMediaLinks";
import AdminDashboard from "@/pages/admin/AdminDashboard";

type Tab = "overview" | "products" | "site" | "blog" | "media";

export default function AdminShell() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

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
                  <Button variant={tab === "overview" ? "default" : "outline"} className="w-full" onClick={() => setTab("overview")}>
                    Overview
                  </Button>
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
                    {tab === "overview" && "Overview"}
                    {tab === "products" && "Products"}
                    {tab === "site" && "Site Content"}
                    {tab === "blog" && "Blog"}
                    {tab === "media" && "Media URLs"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tab === "overview" && <AdminDashboard />}
                  {tab === "products" && <AdminProducts />}
                  {tab === "site" && <AdminSiteContent />}
                  {tab === "blog" && <AdminBlog />}
                  {tab === "media" && <AdminMediaLinks />}
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
