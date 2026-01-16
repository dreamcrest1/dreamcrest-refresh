import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig, navLinks } from "@/data/siteData";
import logo from "@/assets/dreamcrest-logo.png";

function buildEmail(parts: string[]) {
  return parts.join("");
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16 md:mt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div>
            <img src={logo} alt="Dreamcrest" className="h-12 w-auto mb-4" />
            <p className="text-foreground text-sm mb-4">
              {siteConfig.tagline}
            </p>
            <div className="flex gap-3">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-foreground/80 hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sister Brands */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Brands</h4>
            <ul className="space-y-2">
              {siteConfig.sisterBrands.map((brand) => (
                <li key={brand.name}>
                  <a href={brand.url} target="_blank" rel="noopener" className="text-foreground/80 hover:text-primary transition-colors text-sm">
                    {brand.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.pincode}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-primary">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                {(() => {
                  const email = buildEmail(["dreamcrestsolutions", "@", "gmail", ".com"]);
                  return (
                    <a href={`mailto:${email}`} className="hover:text-primary break-all">
                      {email}
                    </a>
                  );
                })()}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-foreground/70">
          <p>© {new Date().getFullYear()} Dreamcrest Solutions. All rights reserved.</p>
          <p className="mt-2 text-xs text-foreground/50">
            India's Most Trusted Digital Product Store | Serving 15,000+ Happy Customers Since 2021
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;