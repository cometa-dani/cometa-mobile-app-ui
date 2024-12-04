import { create } from 'zustand';


interface ISearchCityByName {
  placeholder: string;
  setPlaceholder: (kind: 'homeTown' | 'currentLocation') => void;
  selectedCity: string;
  setCityName: (name: string) => void;
  clearCityName: () => void;
}

export const useSelectCityByName = create<ISearchCityByName>((set) => ({
  placeholder: '',
  setPlaceholder: (kind: 'homeTown' | 'currentLocation') => {
    const placeholder = kind === 'homeTown' ? 'Select your Home Town...' : 'Select your Current Location...';
    set({ placeholder });
  },
  selectedCity: '',
  setCityName: (name: string) => set({ selectedCity: name }),
  clearCityName: () => set({ selectedCity: '' })
}));
