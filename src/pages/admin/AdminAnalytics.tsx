import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { BarChart3, Users, Eye, Globe, TrendingUp, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { getAnalyticsSummary } from "@/lib/db/analytics";
import { listProductsAdmin } from "@/lib/db/products";
import { listBlogPostsAdmin } from "@/lib/db/blogPosts";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin", "analytics", timeRange],
    queryFn: () => getAnalyticsSummary(parseInt(timeRange)),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listProductsAdmin,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: listBlogPostsAdmin,
  });

  // Calculate product/blog stats from page views
  const productViews = analytics?.topPages
    .filter(p => p.path.startsWith("/products/") || p.path === "/products")
    .reduce((sum, p) => sum + p.count, 0) || 0;

  const blogViews = analytics?.topPages
    .filter(p => p.path.startsWith("/blog/") || p.path === "/blog")
    .reduce((sum, p) => sum + p.count, 0) || 0;

  const homeViews = analytics?.topPages
    .find(p => p.path === "/")?.count || 0;

  // Format daily chart data
  const chartData = analytics?.dailyViews.map(d => ({
    date: format(new Date(d.date), "MMM d"),
    views: d.count,
  })) || [];

  // Pie chart data for traffic sources
  const pieData = analytics?.trafficSources.slice(0, 5).map((s, i) => ({
    name: s.source,
    value: s.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })) || [];

  if (analyticsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card/50">
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Track your website traffic and visitor engagement.
        </p>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
                <p className="text-3xl font-bold">{analytics?.totalViews.toLocaleString() || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-3xl font-bold">{analytics?.uniqueSessions.toLocaleString() || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Product Views</p>
                <p className="text-3xl font-bold">{productViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blog Views</p>
                <p className="text-3xl font-bold">{blogViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Page Views Chart */}
        <Card className="bg-card/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Page Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available yet. Page views will appear here once visitors start browsing.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {pieData.map((source, i) => (
                    <div key={source.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: source.fill }} 
                        />
                        <span className="truncate max-w-[120px]">{source.name}</span>
                      </div>
                      <span className="text-muted-foreground">{source.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-center">
                <div>
                  <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No traffic data yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Pages */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.topPages && analytics.topPages.length > 0 ? (
              <div className="space-y-3">
                {analytics.topPages.slice(0, 8).map((page, i) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-5">{i + 1}.</span>
                      <span className="text-sm truncate max-w-[250px]">
                        {page.path === "/" ? "Homepage" : page.path}
                      </span>
                    </div>
                    <Badge variant="secondary">{page.count} views</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No page view data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products & Blogs */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Content Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Products</h4>
                {products.slice(0, 3).map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between py-1.5">
                    <span className="text-sm truncate max-w-[200px]">{product.name}</span>
                    <Badge variant={product.published ? "default" : "secondary"}>
                      {product.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="text-sm text-muted-foreground">No products yet</p>
                )}
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Blog Posts</h4>
                {posts.filter(p => p.published).slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-center justify-between py-1.5">
                    <span className="text-sm truncate max-w-[200px]">{post.title}</span>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                ))}
                {posts.filter(p => p.published).length === 0 && (
                  <p className="text-sm text-muted-foreground">No published posts yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
