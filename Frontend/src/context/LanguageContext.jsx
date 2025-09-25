import { createContext, useState, useContext } from "react";
import en from "../translations/en.json";
import hi from "../translations/hi.json";
import ml from "../translations/ml.json";

const translations = { en, hi, ml };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en"); // default English

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
