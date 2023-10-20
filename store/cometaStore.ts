import { create } from 'zustand';
import { EventsListRes } from '../models/Event';


interface StoreState {
  events: {
    data: EventsListRes,
    isLoading: boolean,
    error: string
  }
}

interface StoreActions {
  setEvents: () => Promise<void>
}

const initialState: StoreState = {
  events: {
    data: {} as EventsListRes,
    isLoading: false,
    error: ''
  }
};

export const useCometaStore = create<StoreState & StoreActions>((set, get) => ({
  ...initialState,

  setEvents: async () => {
    // eventsService
  }
}));
