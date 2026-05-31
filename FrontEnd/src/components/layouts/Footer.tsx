import { Facebook, Instagram, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a7c] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 
      grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

        {/* PAYMENT METHODS */}
        <div>
          <h3 className="text-[#d4af37] font-semibold mb-4">
            Payment methods
          </h3>

          <ul className="space-y-2 text-sm">
            <li>Cash on delivery</li>
            <li>Bank transfer</li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-[#d4af37] font-semibold mb-4">
            Info
          </h3>

          <ul className="space-y-2 text-sm">
            <li
              onClick={() => navigate("/about")}
              className="cursor-pointer hover:underline hover:text-[#d4af37] transition"
            >
              About us
            </li>

            <li
              onClick={() => navigate("/contact")}
              className="cursor-pointer hover:underline hover:text-[#d4af37] transition"
            >
              Contact us
            </li>
          </ul>
        </div>

        {/* MAYAN GROUP */}
        <div>
          <h3 className="text-[#d4af37] font-semibold mb-4">
            Mayan’s GROUP
          </h3>

          <ul className="space-y-2 text-sm">
            <li
              onClick={() => navigate("/products")}
              className="cursor-pointer hover:underline hover:text-[#d4af37] transition"
            >
              Mayan’s products
            </li>

            <li
              onClick={() => navigate("/blog")}
              className="cursor-pointer hover:underline hover:text-[#d4af37] transition"
            >
              Blog
            </li>
          </ul>
        </div>

        {/* HEAD OFFICE */}
        <div>
          <h3 className="text-[#d4af37] font-semibold mb-4">
            HEAD OFFICE
          </h3>

          <div className="text-sm space-y-1">
            <p>No 46, Old road</p>
            <p>Watareka</p>
            <p>Meegoda</p>
            </div>
        </div>
     
        {/* FOLLOW US */}
        <div>
          <h3 className="text-[#d4af37] font-semibold mb-4">
            Follow us
          </h3>

          <p className="text-sm mb-4">
            Social media icons
          </p>

          <div className="flex gap-4">
            <Facebook className="cursor-pointer hover:scale-110 hover:text-[#d4af37] transition" />
            <Instagram className="cursor-pointer hover:scale-110 hover:text-[#d4af37] transition" />
            <Twitter className="cursor-pointer hover:scale-110 hover:text-[#d4af37] transition" />
          </div>
          <div className="text-sm space-y-3 mt-4">
            <h2>Email:</h2>
            <h2>Hotline:</h2>
          </div>
        </div>

      </div>

      {/* bottom copyright */}
      <div className="text-center text-sm border-t border-[#1e3a5f4d] py-4">
        © 2026 Mayan Organic Products
      </div>
    </footer>
  );
}