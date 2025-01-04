import { GetFriendShipWithSenderAndReceiver, IGetLatestFriendships, MutateFrienship } from '../models/Friendship';
import { RestApiService } from './restService';
import { FriendShipStatus } from '../models/Friendship';


class FrienshipService {
  private http = RestApiService.getInstance().http;

  getAllLatest(cursor: number, limit: number) {
    const config = {
      params: { cursor, limit }
    };
    return this.http.get<IGetLatestFriendships>('/friendships', config);
  }

  searchFriendsByName(friendUserName: string, cursor: number, limit: number) {
    const config = {
      params: { cursor, limit, friendUserName },
    };
    return this.http.get<IGetLatestFriendships>('/friendships/search', config);
  }

  public getFriendShipByTargetUserID(targetUserUUID: string) {
    return this.http.get<GetFriendShipWithSenderAndReceiver>(`/friendships/${targetUserUUID}`);
  }

  sentFriendShipInvitation(targerUserID: number) {
    const payload = { targetUserId: targerUserID };
    return this.http.post<MutateFrienship>('/friendships', payload);
  }

  deleteFriendShipInvitationByQueryParams(receiverId: number) {
    return this.http.delete(`/friendships?targetUserId=${receiverId}`);
  }

  updateFriendshipByQueryParams(targetUserId: number, status: FriendShipStatus) {
    return this.http.patch<MutateFrienship>(`/friendships?targetUserId=${targetUserId}`, { status });
  }
}

export default new FrienshipService();
