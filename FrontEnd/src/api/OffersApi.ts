export type HotOffer = {
  id: number;
  pluNumber: string;
  nameKey: string;        // 🔑 translation key
  categoryKey: string;    // 🔑 translation key
  image: string;
  mrpPrice: number;
  ourPrice: number;
  discount: number;
  inStock: boolean;
  size: string;
  timeLeftKey: string;    // 🔑 translation key
  soldCount: number;
  isBestSeller?: boolean;
};

export const getHotOffers = async (): Promise<HotOffer[]> => {
  // later → replace with real API
  return [
      {
      id: 1,
      pluNumber: 'WEA001',
      nameKey: "product_red_rice",
      categoryKey: "category_food",
      image: 'https://images.unsplash.com/photo-1763431158054-ccc996a3deac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcmljZSUyMGdyYWluc3xlbnwxfHx8fDE3Njk0OTg2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 850,
      ourPrice: 680,
      discount: 20,
      inStock: true,
      size: '1kg',
      timeLeftKey: "time_2_days",
      soldCount: 145,
      isBestSeller: true
    },
    {
      id: 2,
      pluNumber: 'HON002',
      nameKey: 'product_Honey',
      categoryKey: "category_food",
      image: 'https://images.unsplash.com/photo-1572731410363-1e08a28c8114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaG9uZXklMjBuYXR1cmFsfGVufDF8fHx8MTc2OTQ5MTYzOHww&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 2400,
      ourPrice: 1680,
      discount: 30,
      inStock: true,
      size: '2 x 500g',
      timeLeftKey: "time_3_days",
      soldCount: 98,
      isBestSeller: true
    },
    {
      id: 3,
      pluNumber: 'COI003',
      nameKey: 'product_Coconut_Oil',
      categoryKey: "category_food",
      image: 'https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwb2lsJTIwbmF0dXJhbHxlbnwxfHx8fDE3Njk0OTg2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 950,
      ourPrice: 665,
      discount: 30,
      inStock: true,
      size: '750ml',
      timeLeftKey: "time_5_days",
      soldCount: 203
    },
    {
      id: 4,
      pluNumber: 'VEG004',
      nameKey: 'product_Vegetables',
      categoryKey: "category_food",
      image: 'https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2OTQ5MTYzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 1200,
      ourPrice: 840,
      discount: 30,
      inStock: true,
      size: '5kg Mixed',
      timeLeftKey: "time_1_days",
      soldCount: 156,
      isBestSeller: true
    },
    // Clothing
    {
      id: 5,
      pluNumber: "HOD005",
      nameKey: "product_hoodie",
      categoryKey: "category_clothing",
      image: "https://images.unsplash.com/photo-1735323694299-e23e3a49e71a",
      mrpPrice: 3500,
      ourPrice: 2450,
      discount: 30,
      inStock: true,
      size: "M, L, XL",
      timeLeftKey: "time_4_days",
      soldCount: 87,
    },
    {
      id: 6,
      pluNumber: 'TSH006',
      nameKey: 'product_T_Shirt',
      categoryKey: "category_clothing",
      image: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwdHNoaXJ0fGVufDF8fHx8MTc2OTQ5OTUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 3000,
      ourPrice: 2100,
      discount: 30,
      inStock: true,
      size: 'Pack of 3',
      timeLeftKey: "time_6_days",
      soldCount: 124
    },
    // Personal Care
    {
      id: 7,
      pluNumber: 'SKI007',
      nameKey: 'product_Skincare_Bundle',
      categoryKey: 'category_personal',
      image: 'https://images.unsplash.com/photo-1639996113206-d9d1817c1aab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3Njk0OTk1MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 4500,
      ourPrice: 2700,
      discount: 40,
      inStock: true,
      size: 'Complete Set',
      timeLeftKey: "time_3_days",
      soldCount: 231,
      isBestSeller: true
    },
    {
      id: 8,
      pluNumber: 'EOI008',
      nameKey: 'product_Essential_Oils',
      categoryKey: 'category_personal',
      image: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwZXNzZW50aWFsJTIwb2lsc3xlbnwxfHx8fDE3Njk0OTk1MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 3600,
      ourPrice: 2160,
      discount: 40,
      inStock: true,
      size: '10 x 10ml',
      timeLeftKey: "time_2_days",
      soldCount: 167
    },
    // Home & Living
    {
      id: 9,
      pluNumber: 'HOM009',
      nameKey: 'product_Cleaning_Bundle',
      categoryKey: 'category_home',
      image: 'https://images.unsplash.com/photo-1647577746559-c9a28c0d0870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY2xlYW5pbmclMjBwcm9kdWN0c3xlbnwxfHx8fDE3Njk0OTk1MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 3200,
      ourPrice: 2240,
      discount: 30,
      inStock: true,
      size: 'Complete Set',
      timeLeftKey: "time_4_days",
      soldCount: 94
    },
    {
      id: 10,
      pluNumber: 'HOM010',
      nameKey: 'product_Bedding_Set',
      categoryKey: 'category_home',
      image: 'https://images.unsplash.com/photo-1761330439252-325f2091e88d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaG9tZSUyMHRleHRpbGVzfGVufDF8fHx8MTc2OTQ5OTUyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 6000,
      ourPrice: 4200,
      discount: 30,
      inStock: true,
      size: 'Queen Size',
      timeLeftKey: "time_5_days",
      soldCount: 73
    },
    // Health & Wellness
    {
      id: 11,
      pluNumber: 'WEL011',
      nameKey: 'product_Supplements_Pack',
      categoryKey: 'category_wellness',
      image: 'https://images.unsplash.com/photo-1763668444855-401b58dceb20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc3VwcGxlbWVudHMlMjB2aXRhbWluc3xlbnwxfHx8fDE3Njk0OTk1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 4800,
      ourPrice: 2880,
      discount: 40,
      inStock: true,
      size: '3 Month Supply',
      timeLeftKey: "time_6_days",
      soldCount: 189,
      isBestSeller: true
    },
    {
      id: 12,
      pluNumber: 'WEL012',
      nameKey: 'product_Superfood_Bundle',
      categoryKey: 'category_wellness',
      image: 'https://images.unsplash.com/photo-1641631370226-5e643faebf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc3VwZXJmb29kcyUyMGhlYWx0aHl8ZW58MXx8fHwxNzY5NDk4NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      mrpPrice: 5500,
      ourPrice: 3850,
      discount: 30,
      inStock: true,
      size: 'Premium Pack',
      timeLeftKey: "time_1_days",
      soldCount: 142
    }
  ];
};
