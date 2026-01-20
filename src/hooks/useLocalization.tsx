import React, { createContext, useContext, useMemo } from 'react';

interface LocalizationContextType {
    locale: string;
    t: (key: string, defaultValue: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        // Fallback for when no provider is present (e.g. testing)
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
            // Check for direct label override first
            if (labels[key]) return labels[key];

            // In a real app, you might have pre-built dictionaries for different locales here
            // const dictionary = DICTIONARIES[locale] || DICTIONARIES['en'];
            // if (dictionary[key]) return dictionary[key];

            return defaultValue;
        }
    }), [locale, labels]);

    return (
        <LocalizationContext.Provider value= { value } >
        { children }
        </LocalizationContext.Provider>
    );
};
