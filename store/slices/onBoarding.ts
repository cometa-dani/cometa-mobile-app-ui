/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { UserClientState } from '../../models/User';


export type OnboardingSlice = {
  onboarding: {
    user: Partial<UserClientState>

  }

  setOnboarding: (user: Partial<UserClientState>) => void
}


export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({

  onboarding: {
    user: {} as UserClientState
  },

  setOnboarding: (user: Partial<UserClientState>) => {
    set({
      onboarding: {
        user
      }
    });
  }
});
