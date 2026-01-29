import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig as defaultSiteConfig, navLinks as defaultNavLinks } from "@/data/siteData";
import { useSiteConfig, useNavLinks, useFooterSettings } from "@/hooks/useSiteContent";
import logo from "@/assets/dreamcrest-logo.png";

function buildEmail(parts: string[]) {
  return parts.join("");
}

export function Footer() {
  // Live content hooks
  const { data: siteConfig } = useSiteConfig();
  const { data: navLinks } = useNavLinks();
  const { data: footerSettings } = useFooterSettings();

  const config = siteConfig ?? defaultSiteConfig;
  const links = navLinks ?? defaultNavLinks;
  const settings = footerSettings ?? {
    showBranding: true,
    copyrightText: "© {year} Dreamcrest Solutions. All rights reserved.",
    subCopyrightText: "India's Most Trusted Digital Product Store | Serving 15,000+ Happy Customers Since 2021",
    quickLinksTitle: "Quick Links",
    brandsTitle: "Our Brands",
    contactTitle: "Contact Us",
  };

  const copyrightText = settings.copyrightText.replace("{year}", new Date().getFullYear().toString());

  return (
    <footer className="bg-card border-t border-border mt-16 md:mt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          {settings.showBranding && (
            <div>
              <img src={logo} alt="Dreamcrest" width={200} height={48} loading="lazy" decoding="async" className="h-12 w-auto mb-4" />
              <p className="text-foreground text-sm mb-4">
                {config.tagline}
              </p>
              <div className="flex gap-3">
                <a href={config.social?.instagram ?? "#"} target="_blank" rel="noopener" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={config.social?.facebook ?? "#"} target="_blank" rel="noopener" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={config.social?.youtube ?? "#"} target="_blank" rel="noopener" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{settings.quickLinksTitle}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
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
            <h4 className="font-semibold text-foreground mb-4">{settings.brandsTitle}</h4>
            <ul className="space-y-2">
              {(config.sisterBrands ?? []).map((brand: any) => (
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
            <h4 className="font-semibold text-foreground mb-4">{settings.contactTitle}</h4>
            <ul className="space-y-3 text-sm text-foreground/80">
              {config.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{config.address.street}, {config.address.city}, {config.address.state} {config.address.pincode}</span>
                </li>
              )}
              {config.contact?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`tel:${config.contact.phone}`} className="hover:text-primary">{config.contact.phone}</a>
                </li>
              )}
              {config.contact?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`mailto:${config.contact.email}`} className="hover:text-primary break-all">
                    {config.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-foreground/70">
          <p>{copyrightText}</p>
          <p className="mt-2 text-xs text-foreground/50">
            {settings.subCopyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
