import { useMutation, useQuery } from '@tanstack/react-query';
import chatGroupService from '../../services/chatGroupService';


export const useQueryGetChatGroupByID = (chatGroupID: string) => {
  return (
    useQuery({
      queryKey: ['chatGroup', chatGroupID],
      queryFn: async () => {
        const res = await chatGroupService.getById(chatGroupID);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};


type MutationArgs = {
  groupName: string, members: (string | number)[]
}

export const useMutationCreateChatGroup = () => {
  return (
    useMutation({
      mutationFn: async ({ groupName, members }: MutationArgs) => {
        const res = await chatGroupService.create(groupName, members);
        if (res.status === 201) {
          return res.data;
        }
        if (res.status === 204) {
          return null;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      onMutate: () => {
        // Update the cache with the new liked state
        // queryClient
        //   .setQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>
        //   ([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION], (data) => ({
        //     pages: data?.pages.map(
        //       (page) => (
        //         {
        //           ...page,
        //           events: page.events.filter(event => eventID !== event.id)
        //         }
        //       )) || [],
        //     pageParams: data?.pageParams || []
        //   }));

        // return eventID;
      },
      // Invalidate queries after the mutation succeeds
      onSuccess: async () => {
        // queryClient
        //   .setQueryData<InfiniteData<GetAllLatestEventsWithPagination, number>>
        //   ([QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION], (oldData) => ({
        //     pages: oldData?.pages.map(
        //       (page) => (
        //         {
        //           ...page,
        //           events: page.events.map(event =>
        //             eventID === event.id ? (
        //               {
        //                 ...event,
        //                 isLiked: false,
        //                 _count: {
        //                   ...event._count,
        //                   likes: event._count.likes - 1
        //                 }
        //               }
        //             ) :
        //               event
        //           )
        //         }
        //       )) || [],

        //     pageParams: oldData?.pageParams || []
        //   }));
      },
      retry: 2,
      retryDelay: 1_000 * 6
    })
  );
};
