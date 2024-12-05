import { create } from 'zustand';


export const MAXIMUN_LANGUAGES = 5;

const removeOrAddLanguage = (language: string) => {
  /**
      *
      * @param {string[]} selectedLanguages  maximum 5 languages
      * @returns
      */
  return function (selectedLanguages: string[]) {
    const isIncluded = selectedLanguages.includes(language);
    const isExceeding = selectedLanguages.length === MAXIMUN_LANGUAGES;
    if (isIncluded) {
      return selectedLanguages.filter(lang => lang !== language); // remove
    }
    else if (!isIncluded && isExceeding) {
      return selectedLanguages; // do nothing
    }
    else {
      return selectedLanguages.concat(language); // add
    }
  };
};

interface ISelectLanguages {
  selectedLanguages: string[];
  setSelectedLanguages: (selectedLanguages: string) => void;
}

export const useSelectLanguages = create<ISelectLanguages>((set) => ({
  selectedLanguages: [],
  setSelectedLanguages: (language: string) => set(prev => ({
    selectedLanguages: removeOrAddLanguage(language)(prev.selectedLanguages)
  }))
}));
