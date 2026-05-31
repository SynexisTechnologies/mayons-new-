import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import ContactFAQ from "../components/contact/ContactFAQ";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
  const socialLinks = [
  {
    icon: <Facebook className="w-6 h-6" />,
    url: "https://www.facebook.com/yourpage",
  },
  {
    icon: <Instagram className="w-6 h-6" />,
    url: "https://www.instagram.com/yourpage",
  },
  {
    icon: <Twitter className="w-6 h-6" />,
    url: "https://twitter.com/yourpage",
  },
  {
    icon: <Linkedin className="w-6 h-6" />,
    url: "https://www.linkedin.com/company/yourpage",
  },
];
  return (
    <div className="pt-24 bg-white">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactFAQ />

      {/* ================= Social Media Section ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl text-[#1e3a5f] mb-4">Follow Us on Social Media</h2>
          <p className="text-gray-600 mb-8">Stay connected for updates, tips, and exclusive offers</p>
          
<div className="flex justify-center space-x-6">
  {socialLinks.map((item, index) => (
    <a
      key={index}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#1e3a5f] text-white p-4 rounded-full hover:bg-[#2a4a7c] transition-all duration-300 shadow-md hover:scale-110"
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
