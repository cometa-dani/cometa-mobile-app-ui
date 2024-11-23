/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { IUserClientState } from '../../models/User';
import { ImagePickerAsset } from 'expo-image-picker';


export type OnboardingSlice = {
  onboarding: {
    user: IUserClientState
  }

  setOnboarding: (user: Partial<IUserClientState>) => void
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  onboarding: {
    user: {
      name: '',
      username: '',
      email: '',
      password: '',
      repassword: '',
      birthday: new Date(),
      homeTown: '',
      currentLocation: '',
      languages: [],
      occupation: '',
      biography: '',
      id: -1,
      uid: ''
    }
  },

  setOnboarding: (user: Partial<IUserClientState>) => {
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
