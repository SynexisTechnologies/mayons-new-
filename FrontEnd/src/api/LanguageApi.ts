const LANGUAGE_KEY = "app_language";

export const getSavedLanguage = async (): Promise<"en" | "si"> => {
  return (localStorage.getItem(LANGUAGE_KEY) as "en" | "si") || "en";
};

export const saveLanguage = async (lang: "en" | "si") => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};
