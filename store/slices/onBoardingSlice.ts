/* eslint-disable no-unused-vars */
import { StateCreator } from 'zustand';
import { IUserClientState } from '../../models/User';


export type OnboardingSlice = {
  onboarding: {
    user: IUserClientState
  }

  setOnboarding: (user: Partial<IUserClientState>) => void
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  onboarding: {
    user: {} as IUserClientState
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
