export const fetchFooterData = async () => {
  return Promise.resolve({
    company: {
      name: "Organi",
      description:
        "Fresh, organic, and sustainable products sourced directly from trusted farmers.",
    },
    links: {
      quick: ["Home", "Shop", "About", "Contact"],
      support: ["FAQ", "Privacy Policy", "Terms & Conditions"],
    },
    contact: {
      address: "Client will provide official address",
      phone: "+94 XX XXX XXXX",
      email: "info@organi.com",
    },
    social: ["facebook", "instagram", "twitter"],
    copyright:
      "© 2026 Organi. All rights reserved.",
  });
};
