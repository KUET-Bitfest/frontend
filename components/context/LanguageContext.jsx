"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") || "en";
      setCurrentLanguage(savedLanguage);
    } catch (error) {
      setCurrentLanguage("en");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleLanguage = () => {
    try {
      const newLanguage = currentLanguage === "en" ? "bn" : "en";
      setCurrentLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
    } catch (error) {
      console.error("Error toggling language:", error);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
