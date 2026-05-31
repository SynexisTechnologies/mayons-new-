import { getSavedLanguage, saveLanguage } from "../api/LanguageApi";

export const loadLanguage = async () => {
  return await getSavedLanguage();
};

export const changeLanguage = async (lang: "en" | "si") => {
  await saveLanguage(lang);
};
