import { StateCreator } from 'zustand';
import { IUserOnboarding } from '../../models/User';


export type OnboardingSlice = {
  onboarding: {
    user: IUserOnboarding
  }
  setOnboarding: (user: Partial<IUserOnboarding>) => void
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
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
