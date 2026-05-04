import React, { createContext, useContext, useState } from 'react';
import { initialVehicles } from './garageData';

const GarageContext = createContext(null);

export function GarageProvider({ children }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [activeVehicleId, setActiveVehicleId] = useState(initialVehicles[0].id);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  const addVehicle = (v) => {
    const newV = { ...v, id: Date.now(), emoji: '🚗', completion: 30, health: 80, mileage: '0', fuelEff: '—', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=450&fit=crop', logoUrl: null };
    setVehicles((prev) => [...prev, newV]);
    setActiveVehicleId(newV.id);
  };

  const updateVehicle = (id, data) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
  };

  const removeVehicle = (id) => {
    setVehicles((prev) => {
      const filtered = prev.filter((v) => v.id !== id);
      if (activeVehicleId === id && filtered.length) setActiveVehicleId(filtered[0].id);
      return filtered;
    });
  };

  return (
    <GarageContext.Provider value={{ vehicles, activeVehicle, activeVehicleId, setActiveVehicleId, addVehicle, updateVehicle, removeVehicle }}>
      {children}
    </GarageContext.Provider>
  );
}

export const useGarage = () => useContext(GarageContext);