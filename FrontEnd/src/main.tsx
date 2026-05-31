
import React from "react";
import { LanguageProvider } from "./context/LanguageContext";
import ReactDOM from "react-dom/client";
import App from "./App"; // <-- now this works, separate file
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <FavoriteProvider>
          <App />
          </FavoriteProvider>
        </CartProvider>
      </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
