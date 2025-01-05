// /* eslint-disable no-unused-vars */
// import { StateCreator } from 'zustand';
// import { IGetBasicUserProfile, IGetDetailedUserProfile } from '../../models/User';


// type User = IGetBasicUserProfile | IGetDetailedUserProfile

// export type NewPeopleSlice = {
//   toggleModal: boolean,
//   setToggleModal: () => void,
//   incommginFriendshipSender: User
//   setIncommginFriendshipSender: (user: User) => void,
// }

// export const createNewPeopleSlice: StateCreator<NewPeopleSlice> = (set) => {
//   return ({
//     toggleModal: false,
//     incommginFriendshipSender: {} as User,

//     setIncommginFriendshipSender: (user) => {
//       set({ incommginFriendshipSender: user });
//     },

//     setToggleModal: () => {
//       set((prev) => ({ toggleModal: !prev.toggleModal }));
//     },
//   });
// };
