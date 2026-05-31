import { Tag } from "lucide-react";
import { useState } from "react";

export default function OffersNewsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSuccess("Successfully subscribed to our newsletter!");
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a7c] text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Tag className="w-16 h-16 mx-auto mb-4 text-[#d4af37]" />

        <h2 className="text-4xl mb-4">Never Miss a Hot Deal!</h2>

        <p className="text-xl mb-8 opacity-90">
          Subscribe to our newsletter and get exclusive offers delivered to your inbox.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-lg text-[#1e3a5f] focus:ring-[#d4af37] text-black"
          />

          <button
            onClick={handleSubscribe}
            className="bg-[#d4af37] text-[#1e3a5f] px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Subscribe
          </button>
        </div>

        {error && <p className="text-red-300 mt-4">{error}</p>}
        {success && <p className="text-green-300 mt-4">{success}</p>}
      </div>
    </section>
  );
}
