import { StateCreator } from 'zustand';



export type SearchPlaceSlice = {
  searchQuery: string,
  scrollToIndex: number,
  setScrollToIndex: (index: number) => void,
  setSearchQuery: (query: string) => void
}

export const createSearchPlaceSlice: StateCreator<SearchPlaceSlice> = (set) => {
  return ({
    scrollToIndex: 0,
    setScrollToIndex: (index) => {
      set({ scrollToIndex: index });
    },
    searchQuery: '',
    setSearchQuery: (query) => {
      set({ searchQuery: query });
    }
  });
};
