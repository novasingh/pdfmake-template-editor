import React, { createContext, useContext, useMemo } from 'react';
import { LOCALES } from '../locales/locales';

interface LocalizationContextType {
    locale: string;
    t: (key: string, defaultValue: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        return {
            locale: 'en',
            t: (key: string, defaultValue: string) => defaultValue
        };
    }
    return context;
};

interface LocalizationProviderProps {
    locale?: string;
    labels?: Record<string, string>;
    children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
    locale = 'en',
    labels = {},
    children
}) => {
    const value = useMemo(() => ({
        locale,
        t: (key: string, defaultValue: string) => {
            // 1. Check for manual label override (e.g. from config.labels)
            if (labels && labels[key]) return labels[key];

            // 2. Check for built-in translation
            const dict = LOCALES[locale] || LOCALES['en'];
            if (dict && dict[key]) return dict[key];

            // 3. Fallback to default
            return defaultValue;
        }
    }), [locale, labels]);

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    );
};
