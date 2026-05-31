import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function OrganicProductHero() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

<div className="relative"> 
  <div className="grid grid-cols-2 gap-4"> 
    
    {/* Left Image */} 
    <div className="relative"> 
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=500&fit=crop" alt="Farmer in field" className="w-full h-[300px] sm:h-[380px] object-cover rounded-3xl shadow-lg" /> 
      </div>
       {/* Right Image - offset downward */} 
       
       <div className="relative mt-12 sm:mt-16"> 
        <img src="https://media.istockphoto.com/id/1222581489/photo/farmer-woman-holding-wooden-box-full-of-fresh-raw-vegetables.jpg?s=612x612&w=0&k=20&c=oqL1nl4fxvYrDCG93r0PXEe2NnARXwPT7RqXFIRSPh8=" 
        alt="Happy farmer with produce" className="w-full h-[300px] sm:h-[380px] object-cover rounded-3xl shadow-lg" /> 
        </div>
</div></div>
        {/* Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-green-700 text-sm font-semibold tracking-wider">
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            <span>{t("productBadge")}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {t("productHeroTitle")}
          </h1>

          <div className="border-l-4 border-green-600 pl-6">
            <p className="text-base sm:text-lg text-gray-600 italic">
              {t("productHeroQuote")}
            </p>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t("productHeroDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
