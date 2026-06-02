export const fetchFooterData = async () => {
  return Promise.resolve({
    company: {
      name: "Mayons",
      description:
        "Fresh, organic, and sustainable products sourced directly from trusted farmers.",
    },
    links: {
      quick: ["Home", "Shop", "About", "Contact"],
      support: ["FAQ", "Privacy Policy", "Terms & Conditions"],
    },
    contact: {
      address: "Client will provide official address",
      phone: "+94 70 244 2317",
      email: "info@mayons.com",
    },
    social: ["facebook", "instagram", "twitter"],
    copyright: "© 2026 Mayons. All rights reserved.",
  });
};
