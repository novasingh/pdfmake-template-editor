export const formatCurrency = (amount: number, currencyCode: string = 'AUD'): string => {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
};

export const parseCurrency = (value: string): number => {
    if (!value) return 0;
    // Remove currency symbol and commas
    const cleaned = value.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
};
