import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndiaMapInteractive from "@/components/IndiaMapInteractive";

export default function BannerTest() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 md:pt-32">
        <div className="container mx-auto px-4">
          <IndiaMapInteractive />
        </div>
      </main>
      <Footer />
    </div>
  );
}
