import { IUserOnboarding } from '@/models/User';
import { create } from 'zustand';


export type ICityKind = Pick<IUserOnboarding, 'homeTown' | 'currentLocation'>


interface ISearchCityByName {
  cityKind: keyof ICityKind;
  setCityKind: (kind: keyof ICityKind) => void;
  selectedCity: ICityKind
  setSelectedCity: (city: ICityKind) => void;
  clearCities: () => void;
}

export const useSelectCityByName = create<ISearchCityByName>((set) => ({
  cityKind: 'homeTown',
  setCityKind: (kind: keyof ICityKind) => {
    set({ cityKind: kind });
  },
  selectedCity: {},
  setSelectedCity: (selectedCity: ICityKind) => set(prev => ({ ...prev, selectedCity })),
  clearCities: () => set({ selectedCity: {} })
}));
