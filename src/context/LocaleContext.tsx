"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as fr from "@/data/portfolio";
import * as en from "@/data/portfolio.en";
import { ui, type UIStrings } from "@/data/ui";

export type Locale = "fr" | "en";

type LocaleContextValue = {
  locale: Locale;
  toggle: () => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "fr",
  toggle: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "fr") setLocale(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const toggle = () => setLocale((l) => (l === "fr" ? "en" : "fr"));

  return (
    <LocaleContext.Provider value={{ locale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function usePortfolio() {
  const { locale } = useLocale();
  return locale === "fr" ? fr : en;
}

export function useUI(): UIStrings {
  const { locale } = useLocale();
  return ui[locale];
}
