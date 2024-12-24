import { StateCreator } from 'zustand';
import { IUserOnboarding } from '../../models/User';


export type IOnboardingSlice = {
  onboarding: {
    user: IUserOnboarding
  }
  setOnboarding: (user: Partial<IUserOnboarding>) => void,
  clearOnboarding: () => void
}

const initialValue = {
  name: '',
  username: '',
  email: '',
  birthday: '',
  password: '',
  repassword: '',
  homeTown: '',
  currentLocation: '',
  languages: [],
  occupation: '',
  biography: '',
  photos: [],
  uid: ''
};

export const createOnboardingSlice: StateCreator<IOnboardingSlice> = (set) => ({
  onboarding: {
    user: initialValue
  },

  setOnboarding: (user: Partial<IUserOnboarding>) => {
    set(prev => ({
      onboarding: {
        user: {
          ...prev.onboarding.user,
          ...user
        }
      }
    }));
  },

  clearOnboarding: () => {
    set({ onboarding: { user: initialValue } });
  }
});
