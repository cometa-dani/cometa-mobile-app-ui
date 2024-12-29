import { useInfiniteQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import { IGetPaginatedLikedEventsBucketList } from '../../models/LikedEvent';
import { QueryKeys } from '../queryKeys';
import { IGetLatestPaginatedEvents } from '@/models/Event';


export const useInfiniteQueryGetTargetUserBucketList = (targetUserId?: number) => {
  return (
    useInfiniteQuery({
      enabled: !!targetUserId,
      queryKey: [QueryKeys.GET_TARGET_USER_BUCKETLIST, targetUserId],
      initialPageParam: -1,
      queryFn: async ({ pageParam }): Promise<IGetPaginatedLikedEventsBucketList> => {
        const res = await eventService.getLikedEventsByUserIdWithPagination(pageParam, 4, targetUserId);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      // Define when to stop refetching
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (lastPage?.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      }
    })
  );
};


export const useInfiniteQueryGetSameMatchedEventsByTwoUsers = (targetUserID: string, take = 4, allPhotos = true) => {
  return (
    useInfiniteQuery({
      placeholderData: {
        pageParams: [], pages: [
          {
            items: [
              {
                id: 1,
                photos: [{ url: '', placeholder: '' }],
                location: { name: 'New York City' }
              },
              {
                id: 2,
                photos: [{ url: '', placeholder: '' }],
                location: { name: 'Los Angeles' }
              },
              {
                id: 3,
                photos: [{ url: '', placeholder: '' }],
                location: { name: 'San Francisco' }
              }
            ]
          } as IGetLatestPaginatedEvents
        ]
      },
      initialPageParam: -1,
      enabled: !!targetUserID,
      queryKey: [QueryKeys.GET_MATCHED_EVENTS_BY_TWO_USERS, targetUserID],
      queryFn: async ({ pageParam }): Promise<IGetLatestPaginatedEvents> => {
        const res = await eventService.getSameMatchedEventsByTwoUsersWithPagination(targetUserID, pageParam, take, allPhotos);
        if (res.status === 200) {
          return res.data;
        }
        else {
          throw new Error('failed to request data');
        }
      },
      getNextPageParam: (lastPage) => {
        // stops incrementing next page because there no more events left
        if (lastPage.hasNextCursor) {
          return lastPage.nextCursor;
        }
        return null; // makes hasNextPage evalutes to false
      }
    })
  );
};

// const dummyBucketListItems = [
//   {
//     id: 1,
//     img: defaultImgPlaceholder,
//     placeholder: 'thumbhash1',
//     location: 'New York City'
//   },
//   {
//     id: 2,
//     img: defaultImgPlaceholder,
//     placeholder: 'thumbhash2',
//     location: 'Los Angeles'
//   },
//   {
//     id: 3,
//     img: defaultImgPlaceholder,
//     placeholder: 'thumbhash3',
//     location: 'San Francisco'
//   }
// ];
