import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useApi';

const SettingsContext = createContext(null);

export const WEIGHT_UNITS = {
  GRAMS: 'grams',
  OUNCES: 'ounces',
  KILOGRAMS: 'kilograms',
  POUNDS: 'pounds'
};

const CONVERSION_RATES = {
  grams: 1,
  ounces: 0.035274,
  kilograms: 0.001,
  pounds: 0.00220462
};

export function SettingsProvider({ children }) {
  const [weightUnit, setWeightUnit] = useLocalStorage('weightUnit', WEIGHT_UNITS.GRAMS);

  const convertWeight = (weightInGrams) => {
    if (!weightInGrams && weightInGrams !== 0) return null;
    return weightInGrams * CONVERSION_RATES[weightUnit];
  };

  const formatWeight = (weightInGrams, options = {}) => {
    const { showUnit = true, decimals = 2 } = options;

    if (!weightInGrams && weightInGrams !== 0) return 'N/A';

    const converted = convertWeight(weightInGrams);

    // Auto-convert to larger unit if appropriate
    if (weightUnit === WEIGHT_UNITS.GRAMS && converted >= 1000) {
      const kg = converted / 1000;
      return showUnit ? `${kg.toFixed(decimals)} kg` : kg.toFixed(decimals);
    }

    if (weightUnit === WEIGHT_UNITS.OUNCES && converted >= 16) {
      const lbs = converted / 16;
      return showUnit ? `${lbs.toFixed(decimals)} lb` : lbs.toFixed(decimals);
    }

    const unitLabels = {
      [WEIGHT_UNITS.GRAMS]: 'g',
      [WEIGHT_UNITS.OUNCES]: 'oz',
      [WEIGHT_UNITS.KILOGRAMS]: 'kg',
      [WEIGHT_UNITS.POUNDS]: 'lb'
    };

    const formatted = converted.toFixed(decimals);
    return showUnit ? `${formatted} ${unitLabels[weightUnit]}` : formatted;
  };

  const getUnitLabel = () => {
    const labels = {
      [WEIGHT_UNITS.GRAMS]: 'Grams (g)',
      [WEIGHT_UNITS.OUNCES]: 'Ounces (oz)',
      [WEIGHT_UNITS.KILOGRAMS]: 'Kilograms (kg)',
      [WEIGHT_UNITS.POUNDS]: 'Pounds (lb)'
    };
    return labels[weightUnit];
  };

  return (
    <SettingsContext.Provider value={{
      weightUnit,
      setWeightUnit,
      formatWeight,
      convertWeight,
      getUnitLabel,
      WEIGHT_UNITS
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
