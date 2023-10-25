/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { UserRes } from '../../models/User';


export type OnboardingSlice = {
  onboarding: {
    user: Partial<UserRes>

  }

  setOnboarding: (user: Partial<UserRes>) => void
}


export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({

  onboarding: {
    user: {} as UserRes
  },

  setOnboarding: (user: Partial<UserRes>) => {
    set({
      onboarding: {
        user
      }
    });
  }
});
