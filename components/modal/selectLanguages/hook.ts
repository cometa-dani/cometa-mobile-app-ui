import { create } from 'zustand';


interface ISelectLanguages {
  selectedLanguages: string[];
  addLanguage: (name: string) => void;
  removeLanguage: (name: string) => void;
}

export const useSelectLanguages = create<ISelectLanguages>((set) => ({
  selectedLanguages: [],
  addLanguage: (name: string) => set(prev => ({ selectedLanguages: [...new Set([...prev.selectedLanguages, name])] })),
  removeLanguage: (name) => set(prev => ({ selectedLanguages: prev.selectedLanguages.filter(lang => lang !== name) }))
}));
