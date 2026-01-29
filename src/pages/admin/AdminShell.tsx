import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Image, Settings, Palette, Home, ChevronRight, Megaphone, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminSiteContent from "@/pages/admin/AdminSiteContent";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminMediaLinks from "@/pages/admin/AdminMediaLinks";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAppearance from "@/pages/admin/AdminAppearance";
import AdminHomepage from "@/pages/admin/AdminHomepage";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminPopups from "@/pages/admin/AdminPopups";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

type Tab = "overview" | "analytics" | "products" | "site" | "blog" | "media" | "appearance" | "homepage" | "popups" | "settings";

const menuItems: Array<{ id: Tab; label: string; icon: React.ElementType; description?: string }> = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, description: "Overview & stats" },
  { id: "analytics", label: "Analytics", icon: BarChart3, description: "Traffic & visitors" },
  { id: "products", label: "Products", icon: Package, description: "Manage products" },
  { id: "blog", label: "Blog Posts", icon: FileText, description: "Articles & news" },
  { id: "popups", label: "Popups", icon: Megaphone, description: "Banners & promotions" },
  { id: "media", label: "Media URLs", icon: Image, description: "Image & file links" },
  { id: "homepage", label: "Homepage", icon: Home, description: "Hero, stats, about" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Header, nav, footer" },
  { id: "settings", label: "Settings", icon: Settings, description: "Site config, contact" },
  { id: "site", label: "Raw Content", icon: FileText, description: "Advanced JSON editor" },
];

export default function AdminShell() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  const currentItem = menuItems.find((m) => m.id === tab);

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <Card className="bg-card/80 backdrop-blur sticky top-28">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Admin Panel
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Manage your website</p>
                </CardHeader>
                <CardContent className="space-y-1 pb-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group",
                        tab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0",
                        tab === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.label}</div>
                        {item.description && (
                          <div className={cn(
                            "text-xs truncate",
                            tab === item.id ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 shrink-0 opacity-0 transition-opacity",
                        tab === item.id && "opacity-100"
                      )} />
                    </button>
                  ))}

                  <div className="pt-4 border-t border-border mt-4 flex gap-2">
                    <Link to="/" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">View site</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => signOut()}>
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main content */}
            <section className="flex-1 min-w-0">
              <Card className="bg-card/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    {currentItem && <currentItem.icon className="h-6 w-6 text-primary" />}
                    <div>
                      <CardTitle className="text-2xl">{currentItem?.label ?? "Admin"}</CardTitle>
                      {currentItem?.description && (
                        <p className="text-sm text-muted-foreground mt-1">{currentItem.description}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {tab === "overview" && <AdminDashboard />}
                  {tab === "analytics" && <AdminAnalytics />}
                  {tab === "products" && <AdminProducts />}
                  {tab === "site" && <AdminSiteContent />}
                  {tab === "blog" && <AdminBlog />}
                  {tab === "popups" && <AdminPopups />}
                  {tab === "media" && <AdminMediaLinks />}
                  {tab === "appearance" && <AdminAppearance />}
                  {tab === "homepage" && <AdminHomepage />}
                  {tab === "settings" && <AdminSettings />}
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
