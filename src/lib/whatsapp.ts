import { siteConfig } from "@/data/siteData";

export function buildWhatsAppInquireUrl(message: string) {
  const phone = siteConfig.contact.phone.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}
