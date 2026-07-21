import { createContext, useContext, useEffect, useState } from "react";
import { loadLanguage, changeLanguage } from "../services/LanguageService";
import { Contact } from "lucide-react";

type Language = "en" | "si";

const translations = {
  en: {
    search: "Search products...",
    allCategory: "All Categories",
    home: "Home",
    event: "Event",
    eats: "Eats",
    offers: "Hot Offers",
    about: "About Us",
    products: "Our Products",
    blog: "Blog",
    adminPanel: "Admin Panel",
    register: "Register",
    /* HERO */
    heroBadge: "CERTIFIED ORGANIC PRODUCTS",
    heroTitlePrefix: "Shop Pure",
    heroTitleHighlight: "Organic Products",
    heroDescription:
      "Explore a curated collection of certified organic products — from daily essentials and wellness items to skincare, home care, apparel, and sustainable lifestyle products. Ethically sourced, naturally made, and delivered with uncompromising quality.",
    exploreMore: "Explore Collection",
    register1: "Join Community",
    continue: "Continue",
    /* FEATURES */
    featureOrganic: "Certified Organic",
    featurePrice: "Best Market Value",
    featureQuality: "Quality Assured",

    /* FOOD PAGE (PRODUCT HERO) */
    productBadge: "NATURAL • SUSTAINABLE • ORGANIC",
    productHeroTitle: "Your Trusted Organic Product Store",
    productHeroQuote:
      "Pure products for a healthier lifestyle — crafted by nature, perfected for modern living.",
    productHeroDesc:
      "We offer a wide range of certified organic products including personal care, cosmetics, herbal items, essential oils, natural cleaning products, organic apparel, pet care, and eco-friendly home solutions. Every product is carefully selected to support a healthier, more sustainable way of life.",

    /* TRENDING */
    trendingBadge: "TRENDING COLLECTIONS",
    trendingTitle: "Popular Categories",

    cat_products: "Organic Lifestyle Products",
    cat_products_sub: "Pure • Natural • Sustainable",

    cat_beauty: "Organic Beauty & Care",
    cat_beauty_sub: "Skin • Hair • Wellness",

    cat_home: "Eco Home Essentials",
    cat_home_sub: "Clean • Green • Safe",
    shopNow: "Shop Now",
    "Meat and Poultry": "Meat and Poultry",
    "Fruits and Vegetables": "Fruits and Vegetables",
    "Grains and Minerals": "Grains and Minerals",
    "Dairy Products": "Dairy Products",
    "Herbs and Spices": "Herbs and Spices",
    "Packaged Foods": "Packaged Foods",
    Snacks: "Snacks",
    "Oilseeds and Oils": "Oilseeds and Oils",
    Sweeteners: "Sweeteners",
    Cosmetics: "Cosmetics",
    Skincare: "Skincare",
    "Essential Oils": "Essential Oils",
    "Tea & Coffee": "Tea & Coffee",
    "Home Textiles": "Home Textiles",
    Apparel: "Apparel",
    Hoodies: "Hoodies",
    "Baby Clothing": "Baby Clothing",
    "Pet Products": "Pet Products",
    "Cleaning Products": "Cleaning Products",
    "Garden Supplies": "Garden Supplies",

    /* ABOUT PAGE */
    aboutTitle: "About Mayons Fresh Product",
    aboutDescription:
      "We're on a mission to bring fresh, organic, and sustainable products directly from local farms to your table. Every product we offer is carefully selected to ensure the highest quality and environmental responsibility.",
    ourStoryTitle: "Grown with Love, Delivered with Care",
    ourStoryP1:
      "Founded in 2020, Mayons Fresh Product started with a simple idea: everyone deserves access to fresh, organic produce that's good for both people and the planet.",
    ourStoryP2:
      "We work directly with certified organic farms within a 100-mile radius, ensuring freshness and supporting local agriculture.",
    ourStoryP3:
      "Today, we're proud to serve thousands of families who trust us to deliver the freshest organic produce right to their doorsteps.",
    coreValuesTitle: "Our Core Values",
    coreValuesDescription: "These principles guide everything we do.",
    value1Title: "100% Organic",
    value1Text: "Certified organic products without harmful chemicals.",
    value2Title: "Quality Guaranteed",
    value2Text: "100% satisfaction guarantee on all products.",
    value3Title: "Sustainability",
    value3Text: "Protecting the planet for future generations.",
    value4Title: "Local Community",
    value4Text: "Supporting local farmers and families.",
    value5Title: "Fast Delivery",
    value5Text: "Delivered within 24 hours of harvest.",
    value6Title: "Transparency",
    value6Text: "Know exactly where your food comes from.",
    missionTitle: "Our Mission",
    missionDescription:
      "To make organic, healthy living accessible to everyone while supporting sustainable farming practices that protect our environment for future generations.",
    stats1: "50+",
    stats1Label: "Local Farms",
    stats2: "10K+",
    stats2Label: "Happy Customers",
    stats3: "100%",
    stats3Label: "Organic Certified",
    stats4: "24hr",
    stats4Label: "Fresh Delivery",
    whyChooseBadge: "Why Choose Us",
    whyChooseTitle: "The Mayons Difference",
    why1Title: "Farm to Table in 24 Hours",
    why1Text:
      "Unlike traditional grocers, we harvest and deliver within 24 hours, ensuring maximum freshness and nutritional value.",
    why2Title: "Know Your Farmer",
    why2Text:
      "Every product includes information about the farm it came from, so you know exactly where your food originates.",
    why3Title: "Eco-Friendly Packaging",
    why3Text:
      "All our packaging is 100% recyclable or compostable, because sustainability extends beyond the farm.",
    why4Title: "Fair Pricing",
    why4Text:
      "By working directly with farmers, we eliminate middlemen and pass the savings on to you.",
    ctaTitle: "Join Our Organic Community",
    ctaDescription:
      "Experience truly fresh organic produce while supporting sustainable farming.",
    ctaButton1: "Get Started",
    ctaButton2: "Learn More",

    my_favorites: "My Favorites Products.",
    clearAll: "Clear All",
    favorite_msg: "You haven't added any favorites yet.",
    /* Best offer PAGE */
    bestOffers: "Best Offers",
    viewMore: "View More",
    favorites: "Favorites",
    VEGETABLES: "Vegetables",
    MEATS: "Meats",
    FROZEN: "Frozen Foods",
    FISHES: "Fish",

    organicBroccoli: "Organic Broccoli",
    organicBroccoliDesc: "Organic broccoli is rich in vitamins C and K.",

    premiumBeef: "Premium Beef Steak",
    premiumBeefDesc: "Premium beef steak high in protein.",

    frozenPizza: "Frozen Pizza",
    frozenPizzaDesc: "Frozen pizza with great taste.",

    freshSalmon: "Fresh Salmon Fillet",
    freshSalmonDesc: "Salmon rich in omega-3.",

    perKg: "per kg",
    perPack: "per pack",
    reviews: "reviews",

    stock: "Stock",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    soldOut: "Sold Out",
    edit: "Edit",
    /* ===== MEGA MENU TITLES ===== */
    groceryShop: "Grocery Shop",
    cakes: "Cakes",
    flowers: "Flowers",
    clothing: "Clothing & Apparel",
    bookShop: "Book Shop",
    pharmacy: "Pharmacy/Aurvedic",
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
    delete: "Delete",
    /* ===== GROCERY SHOP SUBCATEGORIES ===== */
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

    pastaNoodlesSoupsPapadamSoyameat:
      "Pasta, Noodles, Soups, Papadam & Soyameat",
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

    household: "Household",
    airFreshner: "Air Freshner",
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
    talkOil: "Talk & Oil",
    loversValentines: "Lovers & Valentines",

    /* ===== CAKES ===== */
    birthdayCakes: "Birthday Cakes",
    cupCakes: "Cup Cakes",

    /* ===== CLOTHING ===== */
    mens: "Men's",
    womens: "Women's",
    kids: "Kids",
    shoesSlippers: "Shoes & Slippers",

    /* ===== BOOK SHOP ===== */
    b5CRExbooks: "B5/CR/EX Books",
    stationary: "Stationary",
    kidsBooks: "Kids Books",
    storyBooks: "Story Books",
    novels: "Novels",
    shortStories: "Short Stories",
    workingBooks: "Working Books",
    otherBooks: "Other Books",

    /* ===== PARTY & RELIGIOUS ===== */
    birthdayItems: "Birthday Items",
    incentsStick: "Incense Stick",

    /* ===== VEGETABLES & FRUITS ===== */
    vegetables: "Vegetables",
    fruits: "Fruits",

    /* ===== HANDWEAR SHOP ===== */
    farmEquipment: "Farm Equipment",
    plumbingAccessories: "Plumbing Accessories",

    /* ===== Login page ===== */
    loginTitle: "Sign In",
    loginSub: "Mayons Fresh account",
    emailLabel: "Email Address :",
    passwordLabel: "Password :",
    signIn: "Sign In",
    backToHome: "Back to Home",
    dontHaveAccount: "Don’t have an account?",
    signUp: "Sign Up",
    forgotPassword: "Forgot password?",
    reset: "Reset",
    invalidEmail: "Please enter a valid email address",
    passwordShort: "Password must be at least 6 characters",
    emailNotRegistered: "Email not registered",
    invalidCredentials: "Invalid email or password",
    loginSuccess: "Login successful ✅",

    /* ===== Register page ===== */
    registerTitle: "Create Account",
    registerSub: "Join the Organic Fresh Product network",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verifyRegister: "Verify & Register",
    alreadyAccount: "Already have an account?",
    signInHere: "Sign In",
    firstLastRequired: "First name and last name are required",
    registerInvalidEmail: "Please enter a valid email address",
    phoneStart: "Phone number must start with +94",
    phoneDigits: "Phone number must contain only digits after +94",
    phoneLength: "After +94, exactly 9 digits are required",
    passwordRules:
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol",
    otpSent: "OTP sent successfully to your email address",
    passwordMismatch: "Passwords do not match",
    otpInvalid: "OTP must be 6 digits",
    registerSuccess: "Registration successful ✅",

    /* ===== Reset Password ===== */
    resetTitle: "Reset Password",
    resetDesc: "Enter your registered email to receive a password reset link",
    emailPlaceholder: "Enter your email address",
    backToLogin: "Back to Login",
    allRightsReserved: "All Rights Reserved",
    resetHeroTitle: "Secure Account Recovery",
    resetHeroDesc: "We help you get back into your account safely and quickly",
    newPassword: "New Password",
    savePassword: "Save Password",
    passwordResetSuccess: "Password reset successfully",
    accountPreview: "Account Details",

    /* ===== Contact Page ===== */
    contactTitle: "Contact Us",
    contactSubtitle:
      "We'd love to hear from you. Reach out for support, feedback, or inquiries.",
    contactPhoneTitle: "Phone",
    contactEmailTitle: "Email",
    contactAddressTitle: "Location",
    contactHoursTitle: "Working Hours",
    contactAddress: "No 46, Old road, Watareka, Meegoda",
    contactHours1: "Mon–Sat: 9:00 AM – 8:00 PM",
    contactHours2: "Sun: 10:00 AM – 6:00 PM",
    contactFormTitle: "Send Us a Message",
    contactFormDesc:
      "Fill out the form below and we'll get back to you shortly.",
    contactName: "Full Name",
    contactName1: "Enter your full name",
    contactEmail: "Email Address",
    contactEmail1: "Enter your email address",
    contactSubject: "Subject",
    contactMessage: "Your Message",
    contactMessage1: "Type your message here...",
    contactSubmit: "Send Message",
    contactRequired: "All required fields must be filled.",
    contactSuccess: "Your message has been sent successfully.",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Quick answers to common questions",
    faq1q: "What are your delivery areas?",
    faq1a: "We deliver across Sri Lanka. Colombo has same-day delivery.",
    faq2q: "Are products certified organic?",
    faq2a: "Yes, all products meet international organic standards.",
    faq3q: "What is your return policy?",
    faq3a: "7-day return policy for non-perishable items.",
    faq4q: "Do you offer bulk purchases?",
    faq4a: "Yes, special pricing is available for bulk orders.",
    contactSelectSubject: "Select a subject",
    contactSubjectGeneral: "General Inquiry",
    contactSubjectProduct: "Product Question",
    contactSubjectOrder: "Order Support",
    contactSubjectPartnership: "Partnership",
    contactSubjectFeedback: "Feedback",
    contactSubjectComplaint: "Complaint",
    contactPhone: "Phone Number",

    /* ===== Cart Page ===== */
    cartTitle: "Your Shopping Cart",
    cartEmpty: "Your cart is empty.",
    subtotal: "Subtotal",
    tax: "Tax (8%)",
    total: "Total",
    proceed: "Proceed to Checkout",
    unit: "Unit",
    remove: "Remove",

    /* ===== Event page ===== */
    eventsTitle: "Upcoming Events",
    eventsDesc:
      "Join our organic community events, workshops, and festivals. Experience sustainability in action!",
    exploreEvents: "Explore Events",
    categoriesAll: "All",
    categoriesFestival: "Festival",
    categoriesMarket: "Market",
    categoriesWorkshop: "Workshop",
    categoriesTour: "Tour",
    categoriesFair: "Fair",
    date: "Date",
    time: "Time",
    location: "Location",
    capacity: "Capacity",
    price: "Price",
    ctaTitle1: "Want to Host an Event?",
    ctaDesc:
      "Partner with us to organize your organic event. Contact our events team today!",
    contactEvents: "Contact Events Team",
    // Event 1
    event1_title: "Organic Food Festival 2026",
    event1_date: "February 15-17, 2026",
    event1_time: "9:00 AM - 6:00 PM",
    event1_location: "Colombo Exhibition Center",
    event1_desc:
      "Join us for the biggest organic food festival featuring 100+ vendors, cooking demonstrations, and farm tours.",
    freeEntry: "Free Entry",
    event1_capacity: "5000 people",
    statusUpcoming: "Upcoming",

    // Event 2
    event2_title: "Farmers Market Weekend",
    event2_date: "Every Saturday & Sunday",
    event2_time: "7:00 AM - 2:00 PM",
    event2_location: "Colombo Main Store",
    event2_desc:
      "Meet local organic farmers and get the freshest produce directly from the source.",
    event2_capacity: "1000 people",
    statusRecurring: "Recurring",

    // Event 3
    event3_title: "Organic Cooking Masterclass",
    event3_date: "February 20, 2026",
    event3_time: "2:00 PM - 5:00 PM",
    event3_location: "Colombo Culinary Studio",
    event3_desc:
      "Learn to prepare delicious organic meals from professional chefs.",
    event_price_2500: "Rs 2,500",
    event3_capacity: "30 people",
    statusRegistrationOpen: "Registration Open",

    // Event 4
    event4_title: "Sustainable Living Workshop",
    event4_date: "February 25, 2026",
    event4_time: "10:00 AM - 4:00 PM",
    event4_location: "Green Community Center",
    event4_desc:
      "Discover tips and tricks for living a more sustainable and eco-friendly lifestyle.",
    event_price_1500: "Rs 1,500",
    event4_capacity: "50 people",

    // Event 5
    event5_title: "Farm Tour & Experience",
    event5_date: "March 5, 2026",
    event5_time: "8:00 AM - 1:00 PM",
    event5_location: "Organic Valley Farm",
    event5_desc:
      "Experience organic farming firsthand and learn about sustainable agriculture practices.",
    event_price_3000: "Rs 3,000",
    event5_capacity: "40 people",
    statusLimitedSeats: "Limited Seats",

    // Event 6
    event6_title: "Organic Beauty & Wellness Fair",
    event6_date: "March 10-12, 2026",
    event6_time: "10:00 AM - 7:00 PM",
    event6_location: "City Convention Hall",
    event6_desc:
      "Explore organic beauty products, wellness solutions, and natural skincare.",
    event_price_500: "Rs 500",
    event6_capacity: "3000 people",

    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    numberOfTickets: "Number of Tickets",
    Ticket1: "1 Ticket",
    Tickets2: "2 Tickets",
    Tickets3: "3 Tickets",
    Tickets4: "4 Tickets",
    Tickets5: "5 Tickets",
    dietaryPreferences: "Dietary Preferences",
    specialRequirements: "Special Requirements",
    registerEvent: "Register",
    registrationSuccess: "Registration successful! Thank you for joining us.",

    eats_title: "Organic Eats",
    discover_text: "Healthy, fresh & sustainable organic food experiences.",
    explore_text: "Explore Restaurants",
    view_menu: "View Menu",
    add_to_cart: "Add to Cart",
    certified: "Certified",
    Rs: "Rs.",
    all: "All",
    international: "International",
    cafe: "Cafe",
    sri_lankan: "Sri Lankan",
    healthy_bowl: "Healthy Bowl",
    vegan: "Vegan",
    farm_to_table: "Farm-to-Table",

    // ================= RESTAURANT NAMES =================
    "restaurants.organicBistro": "Organic Bistro",
    "restaurants.greenLeafCafe": "Green Leaf Cafe",
    "restaurants.naturalFlavors": "Natural Flavors",
    "restaurants.freshBowl": "Fresh Bowl",
    "restaurants.pureVeganKitchen": "Pure Vegan Kitchen",
    "restaurants.harvestTable": "Harvest Table",

    // ================= LOCATIONS =================
    "locations.colombo07": "Colombo 07",
    "locations.kandyCity": "Kandy City",
    "locations.galleFort": "Galle Fort",
    "locations.colombo03": "Colombo 03",
    "locations.nugegoda": "Nugegoda",
    "locations.matara": "Matara",

    // ================= OPENING HOURS =================
    "hours.bistro": "11:00 AM - 10:00 PM",
    "hours.cafe": "8:00 AM - 8:00 PM",
    "hours.flavors": "12:00 PM - 11:00 PM",
    "hours.freshBowl": "10:00 AM - 9:00 PM",
    "hours.veganKitchen": "11:00 AM - 10:00 PM",
    "hours.harvest": "9:00 AM - 9:00 PM",

    // ================= PRICE RANGE =================
    "priceEats.bistro": "1,500 - 3,000",
    "priceEats.cafe": "800 - 2,000",
    "priceEats.flavors": "1,200 - 2,500",
    "priceEats.freshBowl": "900 - 1,800",
    "priceEats.veganKitchen": "1,000 - 2,200",
    "priceEats.harvest": "1,300 - 2,800",

    // ================= MENU ITEMS =================
    menu_appetizers: "Appetizers",
    menu_main: "Main Course",
    menu_beverages: "Beverages",
    menu_breakfast: "Breakfast",

    // Menu item names (optional, if using `nameKey` in menu)
    gardenSalad: "Garden Salad",
    avocadoToast: "Avocado Toast",
    grilledChicken: "Grilled Organic Chicken",
    buddhaBowl: "Vegan Buddha Bowl",
    greenSmoothie: "Fresh Green Smoothie",
    pancakes: "Organic Pancakes",
    acaiBowl: "Acai Bowl",
    freshBroccoli: "Fresh Broccoli",
    // Menu item descriptions
    gardenSaladDesc: "Fresh garden vegetables with a light vinaigrette.",
    avocadoToastDesc:
      "Organic sourdough with smashed avocado and cherry tomatoes.",
    grilledChickenDesc:
      "Free-range chicken with seasonal vegetables and quinoa.",
    buddhaBowlDesc:
      "Quinoa, roasted vegetables, chickpeas with tahini dressing.",
    greenSmoothieDesc: "Spinach, banana, mango, and organic almond milk.",
    pancakesDesc: "Fluffy pancakes with organic maple syrup and fresh berries.",
    acaiBowlDesc: "Acai berries, granola, fresh fruits, and organic honey.",
    freshBroccoli_desc:
      "Fresh organic broccoli grown naturally without chemicals. Rich in vitamins and perfect for a healthy diet.",
    organicHoodie_desc:
      "Premium organic cotton hoodie — soft, breathable, and sustainably made for everyday comfort.",
    /* ===== Hot Offers Page ===== */
    hotOffersTitle: "Hot Offers",
    hotOffersSubtitle: "Up to 40% OFF on Organic Products",
    grabDeal: "Grab This Deal",
    off: "OFF",
    sold: "Sold:",
    limited_deal: "Limited Time Deal",
    bestSeller: "BEST SELLER",
    shop_Hot_Deals: "Shop Hot Deals",
    category_all: "All",
    category_discount: "Discount",
    category_limited_Time: "Limited Time",
    category_seasonal: "Seasonal",
    category_clearance: "Clearance",
    category_bogo: "Buy 1 Get 1",
    promo50: "Up to 50% OFF",
    promoFresh: "Fresh Foods",
    promoBogo: "Buy 1 Get 1",
    promoCare: "Personal Care",
    promoWeekend: "Weekend Sale",
    promoHome: "Home Essentials",
    product_red_rice: "Organic Red Rice",
    product_hoodie: "Organic Cotton Hoodie",
    product_Honey: "Wild Honey Bundle",
    product_Coconut_Oil: "Organic Coconut Oil",
    product_Vegetables: "Fresh Vegetables Box",
    product_T_Shirt: "Organic T-Shirt Pack",
    product_Superfood_Bundle: "Superfood Bundle",
    product_Skincare_Bundle: "Organic Skincare Bundle",
    product_Essential_Oils: "Essential Oils Collection",
    product_Cleaning_Bundle: "Eco Cleaning Bundle",
    product_Bedding_Set: "Organic Bedding Set",
    product_Supplements_Pack: "Organic Supplements Pack",

    time_1_days: "1 Days Left",
    time_2_days: "2 Days Left",
    time_3_days: "3 Days Left",
    time_4_days: "4 Days Left",
    time_5_days: "5 Days Left",
    time_6_days: "6 Days Left",

    allProducts: "All Products",
    browse: "Browse our complete collection of organic products",
    filterBy: "Filter by",
    sortBy: "Sort by",
    explore_products: "Explore Products",
    showing: "Showing",

    /* Checkout page */
    Continue_shopping: "Continue Shopping",
    Checkout: "Checkout",
    Recipientinfo: "Recipient's Information",
    Name: "Name",
    PhoneNo: "Phone Number",
    Delivery_Add: "Delivery Address",
    City: "City",
    Location_Type: "Location Type",
    home1: "Home",
    house: "House",
    apartment: "Apartment",
    office: "Office",
    hospital: "Hospital",
    school: "School",
    funeralHome: "Funeral Home",
    weddingReception: "Wedding Reception",
    other: "Other",
    Select_Option: "Select Option",
    Address_Details: "Address Details",
    Sender_Name: "Sender Name",
    Your_Name: "Your Name",
    Delivery_Date: "Delivery Date",
    Payment_Info: "Payment Information",
    Card_No: "Card Number",
    Delivery_Instructions: "Delivery Instructions(Optional)",
    CardHolder_Name: "Cardholder Name",
    Expiry_Date: "Expiry Date",
    CVV: "CVV",
    Order_Summary: "Order Summary",
    Subtotal: "Sub Total",
    Delivery_Fee: "Delivery Fee",
    Place_Order: "Place Order",
    Tot: "Total",
    Statement: "By placing your order, you agree to our terms & conditions",
    Required: "Required",
    ValidPhone: "Enter valid 10-digit phone number",
    Order_Success: "Order placed successfully!",
    Cash_On_Delivery: "Cash on Delivery",
    No_Special_Time_Request:
      "*Special Time requests are not accepted in Delivery Instructions.",
    Delivery_Time: "Delivery Time",
    Send_Order_Alerts: "Send Order Alerts to Receiver.",
  },

  si: {
    search: "නිෂ්පාදන සොයන්න...",
    allCategory: "සියලු කාණ්ඩ",
    home: "මුල් පිටුව",
    event: "සිදුවීම්",
    eats: "ආහාර",
    offers: "විශේෂ දීමනා",
    about: "අප ගැන",
    products: "අපගේ නිෂ්පාදන",
    blog: "බ්ලොග්",
    adminPanel: "පරිපාලක පුවරුව",
    /* HERO */
    heroBadge: "සහතික කළ ජෛවීය නිෂ්පාදන",
    heroTitlePrefix: "පිරිසිදු ලෙස මිලදී ගන්න",
    heroTitleHighlight: "ජෛවීය නිෂ්පාදන",
    heroDescription:
      "දිනපතා භාවිතය සඳහා වන අත්‍යවශ්‍ය නිෂ්පාදනවල සිට රූපලාවන්‍ය, සුවඳ තෙල්, සෞඛ්‍ය සත්කාර, ඇඳුම්, ගෘහ භාණ්ඩ, සත්ත්ව සත්කාර සහ පරිසර හිතකාමී ජීවන රටාවට අදාළ ජෛවීය නිෂ්පාදන එකතුවක් අප සමඟ සොයා ගන්න. වගකීමෙන් සපයන ලද, ස්වභාවිකව නිර්මාණය කළ, විශ්වාස කළ හැකි ගුණාත්මකභාවය.",
    exploreMore: "තව සොයා යන්න",
    register1: "අප සමඟ එක්වන්න",
    /* FEATURES */
    featureOrganic: "සහතික කළ ජෛවීය",
    featurePrice: "හොඳම වටිනාකම",
    featureQuality: "ගුණාත්මකභාවය සහතිකයි",
    continue: "ඉදිරියට යන්න",
    /* FOOD PAGE (PRODUCT HERO) */
    productBadge: "ස්වභාවික • පාරිසරික • ජෛවීය",
    productHeroTitle: "ඔබට විශ්වාස කළ හැකි ජෛවීය නිෂ්පාදන වෙළඳසැල",
    productHeroQuote:
      "සෞඛ්‍ය සම්පන්න ජීවන රටාවක් සඳහා පිරිසිදු නිෂ්පාදන — ස්වභාවයෙන් උපන්, නවීන ජීවිතයට ගැලපෙන ලෙස නිර්මාණය කළ.",
    productHeroDesc:
      "රූපලාවන්‍ය නිෂ්පාදන, සුවඳ තෙල්, සෞඛ්‍ය සත්කාර, පෞද්ගලික සත්කාර, පාරිසරික ගෘහ භාණ්ඩ, ජෛවීය ඇඳුම්, සත්ත්ව සත්කාර සහ ස්වභාවික පිරිසිදු කිරීමේ නිෂ්පාදන ඇතුළු පුළුල් පරාසයක ජෛවීය නිෂ්පාදන අප සපයයි. සෞඛ්‍ය සම්පන්න හා පරිසර හිතකාමී ජීවිතයකට සහාය වීම අපගේ අරමුණයි.",

    /* TRENDING */
    trendingBadge: "ප්‍රවණතා එකතු",
    trendingTitle: "ජනප්‍රිය කාණ්ඩ",

    cat_products: "ජෛවීය ජීවන රටා නිෂ්පාදන",
    cat_products_sub: "පිරිසිදු • ස්වභාවික • පාරිසරික",

    cat_beauty: "ජෛවීය රූපලාවන්‍ය හා සත්කාර",
    cat_beauty_sub: "සම • කෙස් • සුවය",

    cat_home: "පාරිසරික ගෘහ අවශ්‍යතා",
    cat_home_sub: "පිරිසිදු • ආරක්ෂිත • හිතකාමී",
    shopNow: "දැන් සාප්පු යන්න",
    "Meat and Poultry": "මස් සහ කුකුල් මස්",
    "Fruits and Vegetables": "පළතුරු සහ එළවළු",
    "Grains and Minerals": "ධාන්‍ය සහ ඛනිජ",
    "Dairy Products": "කිරි නිෂ්පාදන",
    "Herbs and Spices": "ඖෂධ පැළෑටි සහ කුළු බඩු",
    "Packaged Foods": "ඇසුරුම් කළ ආහාර",
    Snacks: "සුළු ආහාර",
    "Oilseeds and Oils": "තෙල් බීජ සහ තෙල්",
    Sweeteners: "රසකාරක",
    Cosmetics: "රූපලාවන්‍ය",
    Skincare: "චර්ම සත්කාර",
    "Essential Oils": "අත්‍යවශ්‍ය තෙල්",
    "Tea & Coffee": "තේ සහ කෝපි",
    "Home Textiles": "ගෘහ රෙදිපිළි",
    Apparel: "ඇඳුම් පැළඳුම්",
    Hoodies: "හුඩීස්",
    "Baby Clothing": "ළදරු ඇඳුම්",
    "Pet Products": "සත්ත්ව නිෂ්පාදන",
    "Cleaning Products": "පිරිසිදු කිරීමේ නිෂ්පාදන",
    "Garden Supplies": "උද්‍යාන සැපයුම්",

    /* ABOUT PAGE */
    aboutTitle: "අප ගැන - Mayons Fresh Product",
    aboutDescription:
      "අපි අවධානයෙන් තෝරාගත්, තරඟකාරී, පරිසර හිතකාමී ජෛවීය නිෂ්පාදන ඔබේ මේසයට සෘජුවම ගෙන එමින් සිටිමු. අප ලබා දෙන සෑම නිෂ්පාදනයක්ම ඉහළම ගුණාත්මකභාවය සහ පරිසර වගකීම සහතික කරයි.",
    ourStoryTitle: "ආදරයෙන් වර්ධනය කර, සැලකිලිමත් ලෙස ලබාදෙයි",
    ourStoryP1:
      "2020 දී ආරම්භ කරන ලද Mayons Fresh Product සරල අදහසකින් ආරම්භ විය: සෑම කෙනෙකුටම මිනිසුන්ට සහ පෘථිවියට හිතකර, නැවුම්, කාබනික නිෂ්පාදන සඳහා ප්‍රවේශය ලැබිය යුතුය.",
    ourStoryP2:
      "අපි සැතපුම් 100 ක අරයක් තුළ සහතික කළ කාබනික ගොවිපලවල් සමඟ සෘජුවම වැඩ කරන අතර, නැවුම් බව සහතික කරමින් සහ දේශීය කෘෂිකර්මාන්තයට සහාය වෙන්නෙමු.",
    ourStoryP3:
      "අද වන විට, අපව විශ්වාස කරන පවුල් දහස් ගණනකට නැවුම්ම කාබනික නිෂ්පාදන ඔවුන්ගේ දොරකඩටම ලබා දෙමින් සේවය කිරීමට ලැබීම ගැන අපි ආඩම්බර වෙමු.",
    coreValuesTitle: "අපගේ මූලික වටිනාකම්",
    coreValuesDescription: "මෙම මූලධර්ම අප කරන සෑම දෙයකටම මඟ පෙන්වයි.",
    value1Title: "100% ජෛවීය",
    value1Text: "හානිකර රසායනික ද්‍රව්‍ය නොමැතිව සහතික කළ කාබනික නිෂ්පාදන.",
    value2Title: "ගුණාත්මකභාවය සහතිකයි",
    value2Text: "සියලුම නිෂ්පාදන සඳහා 100% තෘප්තිමත් සහතිකය",
    value3Title: "පරිසර හිතකාමීත්වය",
    value3Text: "අනාගත පරම්පරාවන් සඳහා පෘථිවිය ආරක්ෂා කරයි.",
    value4Title: "දේශීය ප්‍රජාව",
    value4Text: "දේශීය ගොවීන්ට සහ පවුල්වලට සහාය වීම.",
    value5Title: "වේගවත් බෙදාහැරීම",
    value5Text: "අස්වැන්න නෙළා ගැනීමෙන් පැය 24ක් ඇතුළත ලබා දෙනු ලැබේ.",
    value6Title: "විනිවිදභාවය",
    value6Text: "ඔබේ ආහාර පැමිණෙන්නේ කොහෙන්දැයි හරියටම දැන ගන්න.",
    missionTitle: "අපගේ අරමුණ",
    missionDescription:
      "අනාගත පරම්පරාවන් සඳහා අපගේ පරිසරය ආරක්ෂා කරන තිරසාර ගොවිතැන් පිළිවෙත් සඳහා සහාය වන අතරම, කාබනික, සෞඛ්‍ය සම්පන්න ජීවිතයක් සැමට ප්‍රවේශ විය හැකි කිරීම.",
    stats1: "50+",
    stats1Label: "දේශීය ගොවිපොළ",
    stats2: "10K+",
    stats2Label: "තෘප්තිමත් ගනුදෙනුකරුවන්",
    stats3: "100%",
    stats3Label: "කාබනික සහතික කළ",
    stats4: "24hr",
    stats4Label: "නැවුම් බෙදාහැරීම",
    whyChooseBadge: "අපව තෝරා ගන්නේ ඇයි?",
    whyChooseTitle: "Mayons Fresh වෙනස්කම",
    why1Title: "පැය 24 ඇතුළත ගොවිපලෙන් මේසයට",
    why1Text:
      "සාම්ප්‍රදායික සිල්ලර වෙළෙන්දන් මෙන් නොව, අපි අස්වැන්න නෙළා පැය 24ක් ඇතුළත බෙදා හරින අතර, උපරිම නැවුම් බව සහ පෝෂණ අගය සහතික කරමු.",
    why2Title: "ඔබේ ගොවියා දැනගන්න",
    why2Text:
      "සෑම නිෂ්පාදනයකම එය පැමිණි ගොවිපල පිළිබඳ තොරතුරු ඇතුළත් වේ, එබැවින් ඔබේ ආහාර ආරම්භ වන්නේ කොහෙන්දැයි ඔබට හරියටම දැනගත හැක.",
    why3Title: "පරිසර හිතකාමී ඇසුරුම්කරණය",
    why3Text:
      "අපගේ සියලුම ඇසුරුම් 100% ප්‍රතිචක්‍රීකරණය කළ හැකි හෝ කොම්පෝස්ට් කළ හැකි ය, මන්ද තිරසාරභාවය ගොවිපලෙන් ඔබ්බට විහිදේ.",
    why4Title: "සාධාරණ මිලකරණය",
    why4Text:
      "ගොවීන් සමඟ සෘජුව වැඩ කිරීමෙන් මැදිහත්කරුවන් ඉවත් කර, ඉතිරි මුදල් ඔබට ලබා දෙන්නෙමු.",
    ctaTitle: "අපගේ ජෛවීය ප්‍රජාවට එක්වන්න",
    ctaDescription:
      "තිරසාර ගොවිතැනට සහාය වෙමින් සැබවින්ම නැවුම් කාබනික නිෂ්පාදන අත්විඳින්න.",
    ctaButton1: "ආරම්භ කරන්න",
    ctaButton2: "වැඩි විස්තර",
    stock: "තොග",
    inStock: "තොග ඇත",
    outOfStock: "තොග අවසන්",
    soldOut: "විකිණී අවසන්",
    edit: "සංස්කරණය කරන්න",
    delete: "මකන්න",
    /* Best offer PAGE */
    bestOffers: "හොඳම දීමනා",
    viewMore: "තවත් බලන්න",

    VEGETABLES: "එළවළු",
    MEATS: "මස්",
    FROZEN: "ශීත කළ ආහාර",
    FISHES: "මසුන්",

    organicBroccoli: "ජෛවීය බ්‍රොකොලි",
    organicBroccoliDesc: "විටමින් C සහ K වලින් සම්පන්න ජෛවීය බ්‍රොකොලි.",

    premiumBeef: "උසස් තත්ත්වයේ හරක් මස් ස්ටේක්",
    premiumBeefDesc: "ප්‍රෝටීනින් සම්පන්න උසස් තත්ත්වයේ හරක් මස්.",

    frozenPizza: "ශීත කළ පිසා",
    frozenPizzaDesc: "ඉතා රසවත් ශීත කළ පිසා.",

    freshSalmon: "නැවුම් සැල්මන් මස්",
    freshSalmonDesc: "ඔමේගා-3 වලින් සම්පන්න සැල්මන්.",

    perKg: "කිලෝ ගෑම් එකකට",
    perPack: "පැකට් එකකට",
    reviews: "සමාලෝචන",

    groceryShop: "අත්භෝජන සහ පානීය",
    cakes: "කේක්",
    flowers: "මල්",
    clothing: "ඇඳුම්",
    bookShop: "පොත් පැන්නි",
    pharmacy: "ඖෂධාගාරය",
    partyReligious: "උත්සව සහ ආගමික",
    vegetablesFruits: "එළවළු සහ පළතුරු",
    bakery: "බේකරි",
    toys: "ඇනම්",
    electronics: "විදුලි උපකරණ",
    kitchenItems: "මුළුතැන්ගෙයි භාණ්ඩ",
    plastic: "ප්ලාස්ටික්",
    petCare: "සතුන් සත්කාර",
    handBagsShoes: "හාන්ඩ්බැග් සහ සපත්තු",
    cosmetics: "කොස්මටික",
    perfumes: "සුවඳ",
    handwearShop: "අත් උපකරණ",

    beverages: "පානීය",
    carbonatedDrinks: "කාබනේටඩ් පානීය",
    cordial: "කෝර්ඩියල්",
    energyDrinks: "බලශක්ති පානීය",
    fruitJuicesNectars: "පළතුරු ජූස් සහ නෙක්ටා",
    liquidMilk: "තරල කිරි",
    malt: "මාල්ට්",
    powderMilk: "පවුඩර් කිරි",
    teaCoffee: "තේ සහ කෝපි",
    water: "ජලය",

    breakfastCereals: "ප්‍රාථමික ආහාර සහ සීරියල්",

    diaryProducts: "කිරි නිෂ්පාදන",
    butterCheese: "බටර් සහ චීස්",
    yoghurtCurd: "යෝගර්ට් සහ කරඩ්",

    riceBulk: "බත් සහ බල්ක්",
    rice: "බත්",
    bulk: "බල්ක්",

    pastaNoodlesSoupsPapadamSoyameat: "පාස්තා, නූඩ්ල්, සුප්, පපාඩම් සහ සොයමීට්",
    jamSpread: "ජෑම් සහ ස්ප්‍රෙඩ්",
    dessertIngredients: "අන්තර්ගත දෙසර්ට්",
    snacksSweets: "සුළු ආහාර සහ මීට",
    biscuits: "බිස්කට්",
    chocolate: "චොකලට්",
    condimentsSaucesOilCoconutMilk: "සෝස්, තෙල් සහ පොල් කිරි",
    cannedFood: "කෑන්ඩ් ආහාර",
    flourInstantMixes: "පිටි සහ ඉන්ස්ටන්ට් මික්ස්",
    spicesSeasoning: "කුළුබඩු සහ රසකාරක",
    eggsDryFish: "බිත්තර සහ වියළි මාළු",

    frozen: "තැඹිලි",
    iceCream: "අයිස්ක්‍රීම්",
    meatSausages: "මස් සහ සොසෙජ්",
    processFood: "සංස්කරණ ආහාර",

    pestControl: "කොටස් පාලනය",

    household: "ගෘහ භාණ්ඩ",
    airFreshner: "ගුවන් පිරිසිදු කිරීමේ ද්‍රව්‍ය",
    carCare: "මෝටර් රථ සත්කාර",
    cleaningAids: "පිරිසිදු කිරීමේ උපකරණ",
    laundrySoap: "ලොන්ඩ්‍රි සහ සෝප්",

    groceryHampers: "ගෘහභාණ්ඩ හෑම්පර්",

    personalCare: "පෞද්ගලික සත්කාර",
    wellness: "සුවය",

    motherBaby: "මව සහ දරුවා",
    babyCare: "ළමුන් සත්කාර",
    babyFoods: "ළමුන් ආහාර",
    babySoap: "ළමුන් සබන්",
    colognesCream: "කොලොන් සහ ක්‍රීම්",
    diapers: "ඩයපර්",
    shampooWashingNeeds: "ෂැම්පු සහ වොෂින් අවශ්‍යතා",
    talkOil: "තෙල් සහ ටෝක්",
    loversValentines: "සෙනෙහස සහ ප්‍රේම",

    birthdayCakes: "උපන්දිනයේ කේක්",
    cupCakes: "කප් කේක්",

    mens: "පිරිමි",
    womens: "ගැහැණු",
    kids: "ළමුන්",
    shoesSlippers: "සපත්තු සහ සිපාව",

    b5CRExbooks: "B5/CR/EX පොත්",
    stationary: "ස්ටේශනරි",
    kidsBooks: "ළමුන්ගේ පොත්",
    storyBooks: "කතාව පොත්",
    novels: "නවල",
    shortStories: "කෙටි කතා",
    workingBooks: "වැඩ පොත්",
    otherBooks: "වෙනත් පොත්",

    birthdayItems: "උපන්දිනයේ භාණ්ඩ",
    incentsStick: "ඉන්සෙන්ස් ස්ටික්",

    vegetables: "එළවළු",
    fruits: "පළතුරු",

    farmEquipment: "ගොවි උපකරණ",
    plumbingAccessories: "ප්ලාම්බිං උපකරණ",

    favorites: "ප්‍රියතම",
    my_favorites: "මගේ ප්‍රියතම ලැයිස්තුව.",
    clearAll: "සියල්ල මකා දමන්න.",
    favorite_msg: "ඔබ තවම ප්‍රියතමයන් කිසිවක් එකතු කර නැත.",

    /* ===== Login page ===== */
    loginTitle: "පිවිසෙන්න",
    loginSub: "Mayons Fresh ගිණුම",
    emailLabel: "විද්‍යුත් තැපැල් ලිපිනය :",
    passwordLabel: "මුරපදය :",
    signIn: "පිවිසෙන්න",
    backToHome: "මුල් පිටුවට පිවිසෙන්න",
    dontHaveAccount: "ගිණුමක් නොමැතිද?",
    signUp: "ලියාපදිංචි වන්න",
    forgotPassword: "මුරපදය අමතකද?",
    reset: "නැවත සැකසීම",
    invalidEmail: "කරුණාකර වලංගු විද්‍යුත් ලිපිනයක් ඇතුල් කරන්න.",
    passwordShort: "මුරපදය අක්ෂර 6 කට වඩා කෙටි නොවිය යුතුයි.",
    emailNotRegistered: "ලියාපදිංචි වූ විද්‍යුත් ලිපිනයක් නොවේ.",
    invalidCredentials: "විද්‍යුත් ලිපිනය හෝ මුරපදය වැරදිය.",
    loginSuccess: "ඇතුල් වීම සාර්ථකයි ✅",

    /* ===== Register page ===== */
    registerTitle: "ගිණුමක් සාදන්න",
    registerSub: "Mayons Fresh Product ජාලයට එක්වන්න",
    firstName: "මුල් නම",
    lastName: "අවසන් නම",
    emailAddress: "විද්‍යුත් තැපැල් ලිපිනය",
    phoneNumber: "දුරකථන අංකය",
    password: "මුරපදය",
    confirmPassword: "මුරපදය තහවුරු කරන්න",
    sendOtp: "OTP යවන්න",
    enterOtp: "OTP ඇතුළත් කරන්න",
    verifyRegister: "තහවුරු කර ලියාපදිංචි වන්න",
    alreadyAccount: "දැනටමත් ගිණුමක් තිබේද?",
    signInHere: "පිවිසෙන්න",
    firstLastRequired: "මුල් නම සහ අවසාන නම අවශ්‍යයි",
    registerInvalidEmail:
      "කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න",
    phoneStart: "දුරකථන අංකය +94 සමඟ ආරම්භ විය යුතුය",
    phoneDigits: "+94ට පසු අංක පමණක් ඇතුළත් කළ යුතුය",
    phoneLength: "+94ට පසු අංක 9ක් විය යුතුය",
    passwordRules: "මුරපදය අවම වශයෙන් අක්ෂර 8ක් විය යුතු අතර ලොකු අකුරක්, කුඩා අකුරක්, අංකයක් සහ සංකේතයක් අඩංගු විය යුතුය",
    otpSent: "OTP ඔබගේ විද්‍යුත් තැපැල් ලිපිනයට සාර්ථකව යවා ඇත",
    passwordMismatch: "මුරපද එකිනෙක නොගැලපේ",
    otpInvalid: "OTP අංක 6ක් විය යුතුය",
    registerSuccess: "ලියාපදිංචිය සාර්ථකයි ✅",

    /* ===== Reset Password ===== */
    resetTitle: "මුරපදය නැවත සැකසීම",
    resetDesc: "ඔබගේ ලියාපදිංචි විද්‍යුත් ලිපිනය ඇතුළත් කරන්න",
    emailPlaceholder: "විද්‍යුත් ලිපිනය ඇතුළත් කරන්න",
    backToLogin: "පිවිසුමට ආපසු යන්න",
    allRightsReserved: "සියලු හිමිකම් ඇවිරිණි",
    resetHeroTitle: "ආරක්ෂිත ගිණුම් ප්‍රතිසාධනය",
    resetHeroDesc: "ඔබගේ ගිණුමට ආරක්ෂිතව නැවත පිවිසීමට අපි උදව් කරමු",
    newPassword: "නව මුරපදය",
    savePassword: "මුරපදය සුරකින්න",
    passwordResetSuccess: "මුරපදය සාර්ථකව යාවත්කාලීන විය",
    accountPreview: "ගිණුම් විස්තර",
    /* ===== Contact Page ===== */
    contactTitle: "අපව සම්බන්ධ කරගන්න",
    contactSubtitle: "ඔබගේ ප්‍රශ්න සහ අදහස් අපට දන්වන්න.",
    contactPhoneTitle: "දුරකථන",
    contactEmailTitle: "ඊමේල්",
    contactAddressTitle: "ලිපිනය",
    contactHoursTitle: "වැඩ කරන වේලාවන්",
    contactAddress: "123 Organic වීදිය, කොළඹ 07",
    contactHours1: "සඳුදා–සෙනසුරාදා: පෙ.ව.9 – ප.ව.8",
    contactHours2: "ඉරිදා: පෙ.ව.10 – ප.ව.6",
    contactFormTitle: "පණිවිඩයක් යවන්න",
    contactFormDesc: "පහත පෝරමය පුරවන්න.",
    contactName: "සම්පූර්ණ නම",
    contactName1: "ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න",
    contactEmail: "ඊමේල් ලිපිනය",
    contactEmail1: "ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න",
    contactSubject: "විෂය",
    contactMessage: "ඔබගේ පණිවිඩය",
    contactMessage1: "ඔබගේ පණිවිඩය මෙහි ඇතුළත් කරන්න...",
    contactSubmit: "යවන්න",
    contactRequired: "අත්‍යවශ්‍ය සියලු ක්ෂේත්‍ර පුරවන්න.",
    contactSuccess: "ඔබගේ පණිවිඩය සාර්ථකව යවා ඇත.",
    faqTitle: "නිතර අසන ප්‍රශ්න",
    faqSubtitle: "සාමාන්‍ය ප්‍රශ්න සඳහා පිළිතුරු",
    faq1q: "බෙදාහැරීමේ ප්‍රදේශ මොනවාද?",
    faq1a: "ශ්‍රී ලංකාව පුරා බෙදාහැරීම සිදුකරයි.",
    faq2q: "නිෂ්පාදන සර්ටිෆිකේට්ද?",
    faq2a: "ඔව්, සියලුම නිෂ්පාදන සර්ටිෆයිඩ් වේ.",
    faq3q: "ආපසු භාර දීමේ ප්‍රතිපත්තිය?",
    faq3a: "දින 7ක් ඇතුළත ආපසු භාරදිය හැක.",
    faq4q: "තොග මිලදී ගැනීම් තිබේද?",
    faq4a: "ඔව්, විශේෂ මිල ගණන් ඇත.",
    contactSelectSubject: "විෂයයක් තෝරන්න",
    contactSubjectGeneral: "සාමාන්‍ය විමසීම",
    contactSubjectProduct: "නිෂ්පාදන ප්‍රශ්නය",
    contactSubjectOrder: "ඇණවුම් සහාය",
    contactSubjectPartnership: "ආයෝජන සහයෝගය",
    contactSubjectFeedback: "ප්‍රතිචාර",
    contactSubjectComplaint: "පැමිණිලි",
    contactPhone: "දුරකථන අංකය",
    /* ===== Cart Page ===== */
    cartTitle: "ඔබේ සාප්පු ට්‍රොලිය",
    cartEmpty: "ඔබගේ ට්‍රොලිය හිස්ව තිබේ.",
    subtotal: "උප මුදල",
    tax: "බදු (8%)",
    total: "එකතුව",
    proceed: "ගෙවීම සඳහා ඉදිරියට යන්න",
    unit: "ඒකකය",
    remove: "ඉවත් කරන්න",

    eventsTitle: "ඉදිරි උත්සව",
    eventsDesc:
      "අපගේ කාබනික ප්‍රජා උත්සව, වැඩමුළු සහ අනෙකුත් උත්සවවලට එක්වන්න. ක්‍රියාවෙහි තිරසාර බව අත්විඳින්න! ",
    exploreEvents: "උත්සව අවස්ථා ගවේෂනය",
    categoriesAll: "සියල්ල",
    categoriesFestival: "උත්සවය",
    categoriesMarket: "වෙළඳපොල",
    categoriesWorkshop: "වැඩමුළුව",
    categoriesTour: "සංචාරය",
    categoriesFair: "ප්‍රදර්ශනය",
    date: "දිනය",
    time: "වේලාව",
    location: "ස්ථානය",
    capacity: "ඉඩ",
    price: "මිල",
    register: "ලියාපදිංචි වන්න",
    ctaTitle1: "උත්සවයක් සංවිධානය කිරීමට අවශ්‍යද?",
    ctaDesc:
      "අප සමඟ එක්ව ඔබේ කාබනික උත්සවය සංවිධානය කරන්න. අදම අපගේ උත්සව කණ්ඩායම සම්බන්ධ කරගන්න!",
    contactEvents: "උත්සව කණ්ඩායම හා සම්බන්ධ වන්න",
    // Event 1
    event1_title: "කාබනික ආහාර උත්සවය 2026",
    event1_date: "පෙබරවාරි 15-17, 2026",
    event1_time: "පෙ.ව. 9:00 - ප.ව. 6:00",
    event1_location: "කොළඹ ප්‍රදර්ශන මධ්‍යස්ථානය",
    event1_desc:
      "100+ වෙළෙන්දන්, කෑම පිසීමේ වැඩසටහන් සහ ගොවිපොල සංචාර ඇතුළත් විශාලතම කාබනික ආහාර උත්සවයට සහභාගී වන්න.",
    freeEntry: "ඇතුල්වීම නොමිලේ",
    event1_capacity: "5000 දෙනා",
    statusUpcoming: "ඉදිරියට පැමිණෙන",

    // Event 2
    event2_title: "ගොවි වෙළඳපොල සති අන්තය",
    event2_date: "සති අන්තයේ සෑම සෙනසුරාදා සහ ඉරිදා",
    event2_time: "පෙ.ව. 7:00 - දහවල් 2:00",
    event2_location: "කොළඹ ප්‍රධාන ගබඩාව",
    event2_desc:
      "ස්ථානයේ සිටම නවතම ආහාර නිෂ්පාදන ලබා ගැනීමට දේශීය කාබනික ගොවිපොල සමඟ හමුවන්න.",
    event2_capacity: "1000 දෙනා",
    statusRecurring: "නිතර පැවැත්වේ",

    // Event 3
    event3_title: "කාබනික ආහාර පිසීමේ මාස්ටර් පන්තිය",
    event3_date: "පෙබරවාරි 20, 2026",
    event3_time: "ප.ව. 2:00 - 5:00",
    event3_location: "කොළඹ ආහාර පිසීමේ මධ්‍යස්ථානය",
    event3_desc: "පළපුරුදු මුළුතැන්ගෙයින් රසවත් කාබනික ආහාර පිසීමට ඉගෙන ගන්න.",
    event_price_2500: "රු. 2,500",
    event3_capacity: "30 දෙනා",
    statusRegistrationOpen: "ලියාපදිංචිය විවෘතයි",

    // Event 4
    event4_title: "තිරසාර ජීවන වැඩමුළුව",
    event4_date: "පෙබරවාරි 25, 2026",
    event4_time: "පෙ.ව. 10:00 - ප.ව. 4:00",
    event4_location: "හරිත ප්‍රජා මධ්‍යස්ථානය",
    event4_desc:
      "තවත් තිරසාර සහ පරිසර හිතකාමී ජීවන රටාවකට උපදෙස් සහ උපකාරක අත්දැකීම්.",
    event_price_1500: "රු. 1,500",
    event4_capacity: "50 දෙනා",

    // Event 5
    event5_title: "ගොවිපොල සංචාරය සහ අත්දැකීම",
    event5_date: "මාර්තු 5, 2026",
    event5_time: "පෙ.ව. 8:00 - දහවල් 1:00",
    event5_location: "කාබනික නිම්න ගොවිපොල",
    event5_desc:
      "කාබනික ගොවිපොල පිළිබඳව සෘජුව අත්දැකීම ලබා ගන්න හා තිරසාර කෘෂිකාර්මික ක්‍රම පිළිබඳ ඉගෙන ගන්න.",
    event_price_3000: "රු. 3,000",
    event5_capacity: "40 දෙනා",
    statusLimitedSeats: "සීමිත ආසන",

    // Event 6
    event6_title: "කාබනික රූපලාවණ්‍ය සහ සෞඛ්‍ය ප්‍රදර්ශනය",
    event6_date: "මාර්තු 10-12, 2026",
    event6_time: "පෙ.ව. 10:00 - ප.ව. 7:00",
    event6_location: "නගර සම්මන්ත්‍රණ ශාලාව",
    event6_desc:
      "කාබනික රූපලාවණ්‍ය නිෂ්පාදන, සෞඛ්‍ය විසඳුම් සහ ස්වාභාවික සම සෙවුම් නිෂ්පාදන පිළිබඳ විමසන්න.",
    event_price_500: "රු. 500",
    event6_capacity: "3000 දෙනා",

    fullName: "සම්පූර්ණ නම",
    email: "ඊ-මේල්",
    phone: "දුරකථන",
    numberOfTickets: "ටිකට් ප්‍රමාණය",
    Ticket1: "ටිකට් 1",
    Tickets2: "ටිකට් 2",
    Tickets3: "ටිකට් 3",
    Tickets4: "ටිකට් 4",
    Tickets5: "ටිකට් 5",
    dietaryPreferences: "ආහාර රුචි",
    specialRequirements: "විශේෂ අවශ්‍යතා",
    registerEvent: "ලියාපදිංචි වන්න",
    registrationSuccess: "ලියාපදිංචිය සාර්ථකයි! ඔබට ස්තුතියි.",

    /* ===== Eats Page ===== */
    eats_title: "ජෛව ආහාර ආපනශාලා",
    discover_text: "සෞඛ්‍ය සම්පන්න, නැවුම් සහ තිරසාර ජෛව ආහාර අත්දැකීම්",
    explore_text: "ආපනශාලා ගවේෂනය",
    view_menu: "මෙනුව බලන්න",
    certified: "සහතික කරන ලද",
    Rs: "රු.",
    add_to_cart: "ට්‍රොලියට එකතු කරන්න",
    all: "සියලු",
    international: "අන්තර්ජාතික",
    cafe: "කැෆේ",
    sri_lankan: "ශ්‍රී ලංකා",
    healthy_bowl: "සෞඛ්‍ය සම්පන්න වට්ටෝරුව",
    vegan: "සම්පූර්ණ ශාක ආහාර",
    farm_to_table: "ගොවිපොළ සිට මේසය දක්වා",
    // ================= RESTAURANT NAMES =================
    "restaurants.organicBistro": "ඔර්ගැනික් බිස්ට්‍රෝ",
    "restaurants.greenLeafCafe": "ග්‍රීන් ලීෆ් කැෆේ",
    "restaurants.naturalFlavors": "නේචරල් ෆ්ලේවර්ස්",
    "restaurants.freshBowl": "ෆ්‍රෙෂ් බෝල්",
    "restaurants.pureVeganKitchen": "පියුර විගන් කිචන්",
    "restaurants.harvestTable": "හැර්වෙස්ට් ටේබල්",

    // ================= LOCATIONS =================
    "locations.colombo07": "කොළඹ 07",
    "locations.kandyCity": "මහනුවර නගරය",
    "locations.galleFort": "ගාල්ල කොටුව",
    "locations.colombo03": "කොළඹ 03",
    "locations.nugegoda": "නුගේගොඩ",
    "locations.matara": "මාතර",
    // ================= OPENING HOURS =================
    "hours.bistro": "පෙ.ව 11:00 - රා.ව 10:00",
    "hours.cafe": "පෙ.ව 8:00 - රා.ව 8:00",
    "hours.flavors": "පෙ.ව 12:00 - රා.ව 11:00",
    "hours.freshBowl": "පෙ.ව 10:00 - රා.ව 9:00",
    "hours.veganKitchen": "පෙ.ව 11:00 - රා.ව 10:00",
    "hours.harvest": "පෙ.ව 9:00 - රා.ව 9:00",

    // ================= PRICE RANGE =================
    "priceEats.bistro": "1,500 - 3,000",
    "priceEats.cafe": "800 - 2,000",
    "priceEats.flavors": "1,200 - 2,500",
    "priceEats.freshBowl": "900 - 1,800",
    "priceEats.veganKitchen": "1,000 - 2,200",
    "priceEats.harvest": "1,300 - 2,800",
    // ================= MENU ITEMS =================

    menu_appetizers: "ආරම්භක ආහාර",
    menu_main: "ප්‍රධාන ආහාර",
    menu_beverages: "පානීය",
    menu_breakfast: "උදේ ආහාර",

    gardenSalad: "ජෛව උද්‍යාන සලාදය",
    avocadoToast: "අලිගැටපේර ටෝස්ට්",
    grilledChicken: "ග්රීල් කරන ලද කුකුළ මස්",
    buddhaBowl: "වීගන් බුද්ධා බෝල්",
    greenSmoothie: "හරිත ස්මුදි",
    pancakes: "ජෛව පැන්කේක්",
    acaiBowl: "අසායි බෝල්",
    freshBroccoli: "නැවුම් බ්‍රොකොලි",

    gardenSaladDesc: "ගෙදර වගා කර හැදූ නැවුම් කාබනික එළවළු",
    avocadoToastDesc: "අලිගැටපේර සහ චෙරී තක්කාලි යොදා සකසන ජෛව සෝර්ඩොව්",
    grilledChickenDesc: "උයන එළවළු සහ ක්විනා සමඟ නිදහස් පෝෂණ කුකුළ මස්",
    buddhaBowlDesc: "ක්විනා, රෝස්ට් කළ එළවළු සහ චණා සමඟ තහිනි",
    greenSmoothieDesc: "ස්පිනිච්, කැරට්, මාංගෝ සහ බද්ද ෆෝක් මිල්ක්",
    pancakesDesc: "රැඳුණු පැන්කේක් මැප්ල් සිරප් සහ ෆ්‍රෙෂ් බෙරිස් සමඟ",
    acaiBowlDesc: "අකායි බෙරි, ග්‍රැනෝලා, නැවුම් පලතුරු සහ කාබනික මී පැණි",
    freshBroccoli_desc:
      "රසායනික ද්‍රව්‍ය නොමැතිව ස්වභාවිකව වගා කරන ලද නැවුම් කාබනික බ්‍රොකොලි. විටමින් වලින් පොහොසත් සහ සෞඛ්‍ය සම්පන්න ආහාර වේලක් සඳහා පරිපූර්ණයි.",
    organicHoodie_desc:
      "වාරික කාබනික කපු හුඩි - මෘදු, හුස්ම ගත හැකි සහ තිරසාර ලෙස එදිනෙදා සුවපහසුව සඳහා සාදා ඇත.",

    /* ===== Hot Offers Page ===== */
    hotOffersTitle: "උණුසුම් වට්ටම්",
    hotOffersSubtitle: "කාබනික නිෂ්පාදන සඳහා 40% දක්වා වට්ටම්",
    grabDeal: "මෙම වට්ටම ලබාගන්න",
    off: "වට්ටම්",
    sold: "විකුණූ:",
    limited_deal: "සීමිත කාල ගනුදෙනු",
    bestSeller: "හොඳම විකුණුම්",
    shop_Hot_Deals: "උණුසුම් වට්ටම් මිලදී ගන්න",
    category_all: "සියල්ල",
    category_discount: "වට්ටම්",
    category_limited_Time: "සීමිත කාලය",
    category_seasonal: "සෘතුමය",
    category_clearance: "අවසන් විකිණුම් තොග",
    category_bogo: "එකක් ගත් විට එකක් නොමිලේ",
    promo50: "50% දක්වා වට්ටම්",
    promoFresh: "නැවුම් ආහාර",
    promoBogo: "එකක් ගන්න එකක් නොමිලේ",
    promoCare: "පුද්ගලික සත්කාර",
    promoWeekend: "සති අන්ත විකිණීම",
    promoHome: "ගෘහ භාණ්ඩ",
    product_red_rice: "කාබනික රතු සහල්",
    product_hoodie: "කාබනික කපු හුඩි",
    product_Honey: "කැලෑ මී පැණි මුළ",
    product_Coconut_Oil: "කාබනික පොල් තෙල්",
    product_Vegetables: "නැවුම් එළවළු පෙට්ටිය",
    product_T_Shirt: "කාබනික ටී-ෂර්ට් මිටිය",
    product_Superfood_Bundle: "සුපිරි ආහාර මුළ",
    product_Skincare_Bundle: "කාබනික සම ආරක්ෂණ පැකේජය",
    product_Essential_Oils: "අත්‍යවශ්‍ය තෙල් එකතුව",
    product_Cleaning_Bundle: "පරිසර පිරිසිදු කිරීමේ පොදිය",
    product_Bedding_Set: "කාබනික ඇඳ ඇතිරිලි කට්ටලය",
    product_Supplements_Pack: "කාබනික අතිරේක ඇසුරුම",

    time_1_days: "දින 1 ඉතිරි",
    time_2_days: "දින 2 ඉතිරි",
    time_3_days: "දින 3 ඉතිරි",
    time_4_days: "දින 4 ඉතිරි",
    time_5_days: "දින 5 ඉතිරි",
    time_6_days: "දින 6 ඉතිරි",

    allProducts: "සියලුම නිෂ්පාදන",
    browse: "කාබනික නිෂ්පාදන එකතුව පිරික්සන්න",
    filterBy: "වර්ගය",
    sortBy: "පිළිවෙල",
    explore_products: "නිෂ්පාදන ගවේෂණය",

    showing: "පෙන්වන්නේ",

    /* Checkout page – Sinhala (si) */
    Continue_shopping: "මිලදී ගැනීම දිගටම කරගෙන යන්න",
    Checkout: "පිටවීම",
    Recipientinfo: "ලබන්නාගේ තොරතුරු",
    Name: "නම",
    PhoneNo: "දුරකථන අංකය",
    Delivery_Add: "බෙදාහැරීමේ ලිපිනය",
    City: "නගරය",
    Location_Type: "ස්ථානයේ වර්ගය",
    home1: "නිවස",
    house: "නිවස",
    apartment: "මහල් නිවාසය",
    office: "කාර්යාලය",
    hospital: "රෝහල",
    school: "පාසල",
    funeralHome: "අවමංගල්‍ය මන්දිරය",
    weddingReception: "විවාහ මංගල උත්සවය",
    other: "වෙනත්",
    Select_Option: "විකල්පයක් තෝරන්න",
    Address_Details: "ලිපින විස්තර",
    Sender_Name: "යවන්නාගේ නම",
    Your_Name: "ඔබේ නම",
    Delivery_Date: "බෙදාහැරීමේ දිනය",
    Payment_Info: "ගෙවීම් තොරතුරු",
    Card_No: "කාඩ් අංකය",
    Delivery_Instructions: "බෙදාහැරීම සඳහා උපදෙස් (විකල්ප)",
    CardHolder_Name: "කාඩ් හිමියාගේ නම",
    Expiry_Date: "කල් ඉකුත් වන දිනය",
    CVV: "CVV",
    Order_Summary: "ඇණවුම් සාරාංශය",
    Subtotal: "උප එකතුව",
    Delivery_Fee: "බෙදාහැරීමේ ගාස්තුව",
    Place_Order: "ඇණවුම තහවුරු කරන්න",
    Tot: "මුළු එකතුව",
    Statement:
      "ඔබගේ ඇණවුම තහවුරු කිරීමෙන්, අපගේ නියමයන් සහ කොන්දේසි වලට ඔබ එකඟ වෙයි",
    Required: "අවශ්‍යයි",
    ValidPhone: "නිවැරදි දුරකථන අංකයක් ඇතුළත් කරන්න",
    Order_Success: "ඔබේ ඇණවුම සාර්ථකව තබා ඇත!",
    Cash_On_Delivery: "බෙදාහැරීමේදී මුදල් ගෙවීම",
    No_Special_Time_Request:
      "*බෙදා හැරීමේ උපදෙස් වල විශේෂ කාල ඉල්ලීම් පිළිගනු නොලැබේ.",
    Delivery_Time: "බෙදාහැරීමේ කාලය",
    Send_Order_Alerts: "ඇණවුම් ඇඟවීම් ලබන්නාට යවන්න",
  },
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load saved language from localStorage if needed
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const setLang = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) =>
    translations[language][key as keyof typeof translations.en] || key;

  const getProductName = (product: any) =>
    language === "en"
      ? product.nameEn || product.nameKey
      : product.nameSi || product.nameKey;

  const getProductDescription = (product: any) =>
    language === "en"
      ? product.descriptionEn || product.description
      : product.descriptionSi || product.description;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setLang,
        t,
        getProductName,
        getProductDescription,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
