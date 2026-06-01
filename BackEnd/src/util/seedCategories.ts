import CategoryModel from "../models/CategoryModel";
import SubCategoryModel from "../models/SubCategory";

// Human-readable English labels for every titleKey used in the hierarchy.
// Sinhala labels live in the frontend LanguageContext (translations.si).
const labels: Record<string, string> = {
  // ── Top-level categories ──────────────────────────────────────────────────
  groceryShop: "Grocery Shop",
  cakes: "Cakes",
  flowers: "Flowers",
  clothing: "Clothing & Apparel",
  bookShop: "Book Shop",
  pharmacy: "Pharmacy / Ayurvedic",
  partyReligious: "Party & Religious",
  vegetablesFruits: "Vegetables & Fruits",
  bakery: "Bakery",
  toys: "Toys",
  electronics: "Electronics",
  kitchenItems: "Kitchen Items",
  plastic: "Plastic",
  petCare: "Pet Care",
  handBagsShoes: "Handbags & Shoes",
  cosmetics: "Cosmetics",
  perfumes: "Perfumes",
  handwearShop: "Handwear Shop",
  // ── Grocery ──────────────────────────────────────────────────────────────
  beverages: "Beverages",
  carbonatedDrinks: "Carbonated Drinks",
  cordial: "Cordial",
  energyDrinks: "Energy Drinks",
  fruitJuicesNectars: "Fruit Juices & Nectars",
  liquidMilk: "Liquid Milk",
  malt: "Malt",
  powderMilk: "Powder Milk",
  teaCoffee: "Tea & Coffee",
  water: "Water",
  breakfastCereals: "Breakfast & Cereals",
  diaryProducts: "Dairy Products",
  butterCheese: "Butter & Cheese",
  yoghurtCurd: "Yoghurt & Curd",
  riceBulk: "Rice & Bulk",
  rice: "Rice",
  bulk: "Bulk",
  pastaNoodlesSoupsPapadamSoyameat: "Pasta, Noodles, Soups, Papadam & Soyameat",
  jamSpread: "Jam & Spread",
  dessertIngredients: "Dessert Ingredients",
  snacksSweets: "Snacks & Sweets",
  biscuits: "Biscuits",
  chocolate: "Chocolate",
  condimentsSaucesOilCoconutMilk: "Condiments, Sauces, Oil & Coconut Milk",
  cannedFood: "Canned Food",
  flourInstantMixes: "Flour & Instant Mixes",
  spicesSeasoning: "Spices & Seasoning",
  eggsDryFish: "Eggs & Dry Fish",
  frozen: "Frozen",
  iceCream: "Ice Cream",
  meatSausages: "Meat & Sausages",
  processFood: "Processed Food",
  pestControl: "Pest Control",
  houseold: "Household",           // typo in key kept for backward compat
  airFreshner: "Air Freshener",
  carCare: "Car Care",
  cleaningAids: "Cleaning Aids",
  laundrySoap: "Laundry & Soap",
  groceryHampers: "Grocery Hampers",
  personalCare: "Personal Care",
  wellness: "Wellness",
  motherBaby: "Mother & Baby",
  babyCare: "Baby Care",
  babyFoods: "Baby Foods",
  babySoap: "Baby Soap",
  colognesCream: "Colognes & Cream",
  diapers: "Diapers",
  shampooWashingNeeds: "Shampoo & Washing Needs",
  talkOil: "Talc & Oil",
  loversValentines: "Lovers & Valentines",
  // ── Cakes ────────────────────────────────────────────────────────────────
  birthdayCakes: "Birthday Cakes",
  cupCakes: "Cup Cakes",
  // ── Clothing ─────────────────────────────────────────────────────────────
  mens: "Men's",
  womens: "Women's",
  kids: "Kids",
  shoesSlippers: "Shoes & Slippers",
  // ── Book Shop ────────────────────────────────────────────────────────────
  b5CRExbooks: "B5 / CR / EX Books",
  stationary: "Stationery",
  kidsBooks: "Kids Books",
  storyBooks: "Story Books",
  novels: "Novels",
  shortStories: "Short Stories",
  workingBooks: "Working Books",
  otherBooks: "Other Books",
  // ── Party & Religious ────────────────────────────────────────────────────
  birthdayItems: "Birthday Items",
  incentsStick: "Incense Sticks",
  // ── Vegetables & Fruits ──────────────────────────────────────────────────
  vegetables: "Vegetables",
  fruits: "Fruits",
  // ── Handwear ─────────────────────────────────────────────────────────────
  farmEquipment: "Farm Equipment",
  plumbingAccessories: "Plumbing Accessories",
};

const label = (key: string) => labels[key] ?? key;

// Category hierarchy — mirrors frontend/src/data/categories.ts
const megaCategories = [
  {
    titleKey: "groceryShop",
    items: [
      { titleKey: "beverages", items: ["carbonatedDrinks","cordial","energyDrinks","fruitJuicesNectars","liquidMilk","malt","powderMilk","teaCoffee","water"] },
      "breakfastCereals",
      { titleKey: "diaryProducts", items: ["butterCheese","yoghurtCurd"] },
      { titleKey: "riceBulk", items: ["rice","bulk"] },
      "pastaNoodlesSoupsPapadamSoyameat",
      "jamSpread",
      "dessertIngredients",
      "snacksSweets",
      "biscuits",
      "chocolate",
      "condimentsSaucesOilCoconutMilk",
      "cannedFood",
      "flourInstantMixes",
      "spicesSeasoning",
      "eggsDryFish",
      { titleKey: "frozen", items: ["iceCream","meatSausages","processFood"] },
      "pestControl",
      { titleKey: "houseold", items: ["airFreshner","carCare","cleaningAids","laundrySoap"] },
      "groceryHampers",
      { titleKey: "personalCare", items: ["wellness"] },
      { titleKey: "motherBaby", items: ["babyCare","babyFoods","babySoap","colognesCream","diapers","shampooWashingNeeds","talkOil","loversValentines"] },
    ],
  },
  { titleKey: "cakes", items: ["birthdayCakes","cupCakes"] },
  { titleKey: "flowers" },
  { titleKey: "clothing", items: ["mens","womens","kids","shoesSlippers"] },
  {
    titleKey: "bookShop",
    items: [
      "b5CRExbooks",
      "stationary",
      "kidsBooks",
      { titleKey: "storyBooks", items: ["novels","shortStories"] },
      "workingBooks",
      "otherBooks",
    ],
  },
  { titleKey: "pharmacy" },
  { titleKey: "partyReligious", items: ["birthdayItems","incentsStick"] },
  { titleKey: "vegetablesFruits", items: ["vegetables","fruits"] },
  { titleKey: "bakery" },
  { titleKey: "toys" },
  { titleKey: "electronics" },
  { titleKey: "kitchenItems" },
  { titleKey: "plastic" },
  { titleKey: "petCare" },
  { titleKey: "handBagsShoes" },
  { titleKey: "cosmetics" },
  { titleKey: "perfumes" },
  { titleKey: "handwearShop", items: ["farmEquipment","plumbingAccessories"] },
];

// Collect leaf/group titleKeys from nested items, de-duplicated
function collectSubKeys(items: any[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const walk = (arr: any[]) => {
    for (const it of arr ?? []) {
      const key = typeof it === "string" ? it : it?.titleKey;
      if (key && !seen.has(key)) { seen.add(key); result.push(key); }
      if (typeof it === "object" && Array.isArray(it.items)) walk(it.items);
    }
  };
  walk(items);
  return result;
}

export const seedCategories = async () => {
  try {
    for (const cat of megaCategories) {
      const catName = label(cat.titleKey);

      let category = await CategoryModel.findOne({ titleKey: cat.titleKey });
      if (!category) {
        category = await CategoryModel.create({
          titleKey: cat.titleKey,
          name: catName,
          items: cat.items ?? [],
        });
        console.log(`✅ Category created: ${catName}`);
      } else {
        // Always sync name + items so the DB reflects the latest hierarchy
        let changed = false;
        if (category.name !== catName) { category.name = catName; changed = true; }
        category.items = cat.items ?? [];
        await category.save();
        if (changed) console.log(`🔄 Category updated: ${catName}`);
      }

      // Upsert subcategories
      const subKeys = collectSubKeys(cat.items ?? []);
      for (const key of subKeys) {
        const subName = label(key);
        const existing = await SubCategoryModel.findOne({ titleKey: key, category: category._id });
        if (!existing) {
          await SubCategoryModel.create({ titleKey: key, name: subName, category: category._id });
        } else if (existing.name !== subName) {
          existing.name = subName;
          await existing.save();
        }
      }
    }
    console.log("✅ Categories seeded/synced");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
};
