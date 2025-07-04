
import React, { createContext, useContext, useState, useEffect } from 'react';

type Unit = 'meters' | 'feet' | 'inches' | 'centimeters';

interface UnitsContextType {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  convertValue: (value: number, fromUnit?: Unit) => number;
  formatValue: (value: number, precision?: number) => string;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const useUnits = () => {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
};

const conversionTable: Record<Unit, number> = {
  meters: 1,
  feet: 3.28084,
  inches: 39.3701,
  centimeters: 100,
};

export const UnitsProvider = ({ children }: { children: React.ReactNode }) => {
  const [unit, setUnit] = useState<Unit>(() => {
    const stored = localStorage.getItem('units');
    return (stored as Unit) || 'meters';
  });

  useEffect(() => {
    localStorage.setItem('units', unit);
  }, [unit]);

  const convertValue = (value: number, fromUnit: Unit = 'meters'): number => {
    // Convert from fromUnit to meters, then to target unit
    const inMeters = value / conversionTable[fromUnit];
    return inMeters * conversionTable[unit];
  };

  const formatValue = (value: number, precision: number = 2): string => {
    const unitLabels: Record<Unit, string> = {
      meters: 'm',
      feet: 'ft',
      inches: 'in',
      centimeters: 'cm',
    };
    
    return `${value.toFixed(precision)}${unitLabels[unit]}`;
  };

  return (
    <UnitsContext.Provider value={{ unit, setUnit, convertValue, formatValue }}>
      {children}
    </UnitsContext.Provider>
  );
};
