import mongoose from "mongoose";
import dotenv from "dotenv";
import CategoryModel from "../models/CategoryModel";
import SubCategoryModel from "../models/SubCategory";

dotenv.config({ path: "./.env" });

// Mirror of FrontEnd/src/data/categories.ts (megaCategories)
const megaCategories = [
  {
    titleKey: "groceryShop",
    items: [
      {
        titleKey: "beverages",
        items: [
          "carbonatedDrinks",
          "cordial",
          "energyDrinks",
          "fruitJuicesNectars",
          "liquidMilk",
          "malt",
          "powderMilk",
          "teaCoffee",
          "water",
        ],
      },
      "breakfastCereals",
      {
        titleKey: "diaryProducts",
        items: ["butterCheese", "diaryProducts", "yoghurtCurd"],
      },
      {
        titleKey: "riceBulk",
        items: ["rice", "bulk"],
      },
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
      {
        titleKey: "frozen",
        items: ["iceCream", "meatSausages", "processFood"],
      },
      "pestControl",
      {
        titleKey: "houseold",
        items: ["airFreshner", "carCare", "cleaningAids", "laundrySoap"],
      },
      "groceryHampers",
      {
        titleKey: "personalCare",
        items: ["wellness"],
      },
      {
        titleKey: "motherBaby",
        items: [
          "babyCare",
          "babyFoods",
          "babySoap",
          "colognesCream",
          "diapers",
          "shampooWashingNeeds",
          "talkOil",
          "loversValentines",
        ],
      },
    ],
  },
  { titleKey: "cakes", items: ["birthdayCakes", "cupCakes"] },
  { titleKey: "flowers" },
  { titleKey: "clothing", items: ["mens", "womens", "kids", "shoesSlippers"] },
  {
    titleKey: "bookShop",
    items: [
      "b5CRExbooks",
      "stationary",
      "kidsBooks",
      { titleKey: "storyBooks", items: ["novels", "shortStories"] },
      "workingBooks",
      "otherBooks",
    ],
  },
  { titleKey: "pharmacy" },
  { titleKey: "partyReligious", items: ["birthdayItems", "incentsStick"] },
  { titleKey: "vegetablesFruits", items: ["vegetables", "fruits"] },
  { titleKey: "bakery" },
  { titleKey: "toys" },
  { titleKey: "electronics" },
  { titleKey: "kitchenItems" },
  { titleKey: "plastic" },
  { titleKey: "petCare" },
  { titleKey: "handBagsShoes" },
  { titleKey: "cosmetics" },
  { titleKey: "perfumes" },
  { titleKey: "handwearShop", items: ["farmEquipment", "plumbingAccessories"] },
];

// Helper to collect all titleKeys from nested items (strings or objects)
function collectTitleKeys(items: any[]): string[] {
  const keys: string[] = [];
  if (!items) return keys;
  for (const it of items) {
    if (typeof it === "string") {
      keys.push(it);
    } else if (typeof it === "object" && it.titleKey) {
      keys.push(it.titleKey);
      if (Array.isArray(it.items)) {
        keys.push(...collectTitleKeys(it.items));
      }
    }
  }
  return keys;
}

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB");

    for (const cat of megaCategories) {
      const exists = await CategoryModel.findOne({ titleKey: cat.titleKey });
      if (!exists) {
        const created = await CategoryModel.create({
          titleKey: cat.titleKey,
          name: cat.titleKey,
          items: cat.items ?? [],
        });
        console.log("Created category:", created.titleKey);

        // create subcategories for any nested keys, linked to this top-level category
        const keys = collectTitleKeys(cat.items ?? []);
        for (const key of keys) {
          const subExists = await SubCategoryModel.findOne({ titleKey: key, category: created._id });
          if (!subExists) {
            await SubCategoryModel.create({ titleKey: key, name: key, category: created._id });
          }
        }
      } else {
        // Update existing category items if needed
        exists.items = cat.items ?? [];
        await exists.save();
        console.log("Updated category items:", exists.titleKey);

        const keys = collectTitleKeys(cat.items ?? []);
        for (const key of keys) {
          const subExists = await SubCategoryModel.findOne({ titleKey: key, category: exists._id });
          if (!subExists) {
            await SubCategoryModel.create({ titleKey: key, name: key, category: exists._id });
          }
        }
      }
    }

    console.log("Mega categories & subcategory entries seeded/updated!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
