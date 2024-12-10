import { EventsList } from '@/components/eventsList/eventsList';
import { useInfiniteQuerySearchEventsByQueryParams } from '@/queries/currentUser/eventHooks';
import { useMutationLikeOrDislikeEvent } from '@/queries/currentUser/likeEventHooks';
import { useCometaStore } from '@/store/cometaStore';
import { SystemBars } from 'react-native-edge-to-edge';


export default function HomeScreen() {
  const searchQuery = useCometaStore(state => state.searchQuery);
  const {
    data,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuerySearchEventsByQueryParams(searchQuery);
  const mutateEventLike = useMutationLikeOrDislikeEvent();
  const evenstData = data?.pages.flatMap(page => page.items) || [];
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <>
      <SystemBars style='light' />
      <EventsList
        items={evenstData}
        isFetched={isFetched}
        onInfiniteScroll={handleInfiniteFetch}
        onPressLikeButton={(eventID) => mutateEventLike.mutate({ eventID })}
      />
    </>
  );
}
