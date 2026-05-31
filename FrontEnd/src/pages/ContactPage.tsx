import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import ContactFAQ from "../components/contact/ContactFAQ";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, url: "https://www.facebook.com/mayansorganic", label: "Facebook" },
  { icon: <Instagram className="w-5 h-5" />, url: "https://www.instagram.com/mayansorganic", label: "Instagram" },
  { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com/mayansorganic", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, url: "https://www.linkedin.com/company/mayansorganic", label: "LinkedIn" },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactFAQ />

      {/* Social Media */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#d4af37] text-xs font-bold tracking-[0.3em] uppercase mb-3">Connect With Us</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mb-3">Follow Our Journey</h2>
          <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">Stay connected for updates, tips, and exclusive offers.</p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1e3a5f] transition shadow-sm hover:scale-110 cursor-pointer"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
