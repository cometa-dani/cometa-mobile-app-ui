import { StateCreator } from 'zustand';
import { EventCategory } from '../../models/Event';
import { MMKV } from 'react-native-mmkv';

const mmvkStorage = new MMKV({ id: 'mmvk.searchFilters' });
// mmvkStorage.clearAll();
export type SearchFiltersSlice = {
  searchFilters: Record<EventCategory, EventCategory | undefined>
  AddOrDeleteSearchFilter: (category: EventCategory) => void;
  resetSearchFilters: () => void;
};

const initialValues: Record<EventCategory, EventCategory | undefined> = {
  'Party': undefined,
  'Cultural': undefined,
  'Educational': undefined,
  'Sports': undefined,
  'Cinema': undefined,
  'Shows': undefined,
  'Gallery': undefined,
  'Park': undefined,
  'Exhibition': undefined,
  'Museum': undefined,
  'Bar': undefined,
  'Theatre': undefined,
  'Festival': undefined,
  'Cafe': undefined,
  'Club': undefined,
  'Restaurant': undefined,
  'Concert': undefined,
  'Brunch': undefined,
};

const storedSearchedKeys = mmvkStorage.getString('searchFilters');
const localValues = storedSearchedKeys?.length ? JSON.parse(storedSearchedKeys) : initialValues;

export const createSearchFiltersSlice: StateCreator<SearchFiltersSlice> = (set) => {
  return {
    searchFilters: localValues,

    AddOrDeleteSearchFilter: (category) => {
      set((prev) => {
        if (prev.searchFilters[category]) {
          const updatedSearchFilters = { ...prev.searchFilters, [category]: undefined };
          mmvkStorage.set('searchFilters', JSON.stringify(updatedSearchFilters));
          return ({
            searchFilters: updatedSearchFilters
          });
        }
        else {
          const updatedSearchFilters = { ...prev.searchFilters, [category]: category };
          mmvkStorage.set('searchFilters', JSON.stringify(updatedSearchFilters));
          return ({
            searchFilters: updatedSearchFilters,
          });
        }
      });
    },

    resetSearchFilters: () => {
      mmvkStorage.set('searchFilters', JSON.stringify({}));
      set({ searchFilters: initialValues });
    },
  };
};
