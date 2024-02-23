/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { LoggedUserClientState } from '../../models/User';


export type OnboardingSlice = {
  onboarding: {
    user: LoggedUserClientState
  }

  setOnboarding: (user: Partial<LoggedUserClientState>) => void
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  onboarding: {
    user: {} as LoggedUserClientState
  },

  setOnboarding: (user: Partial<LoggedUserClientState>) => {
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
