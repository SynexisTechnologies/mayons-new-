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
    <div className="bg-canvas">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactFAQ />

      {/* Social Media */}
      <section className="bg-cream/40 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="eyebrow text-honey justify-center mb-3">Connect With Us</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-3">
            Follow Our Journey
          </h2>
          <p className="text-stone-500 text-sm mb-8 max-w-md mx-auto">
            Stay connected for updates, tips, and exclusive offers.
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="w-12 h-12 bg-evergreen text-white rounded-full flex items-center justify-center hover:bg-honey transition shadow-sm hover:scale-110"
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
