import { StateCreator } from 'zustand';
import { IUserOnboarding } from '../../models/User';


export type IOnboardingSlice = {
  onboarding: {
    user: IUserOnboarding
  }
  setOnboarding: (user: Partial<IUserOnboarding>) => void
}

export const createOnboardingSlice: StateCreator<IOnboardingSlice> = (set) => ({
  onboarding: {
    user: {
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
    }
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
  }
});
