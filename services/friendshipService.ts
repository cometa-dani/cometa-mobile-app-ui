import { GetFriendShipWithSenderAndReceiver, GetLatestFriendships, MutateFrienship } from '../models/Friendship';
import { RestApiService } from './restService';
import { FriendShipStatus } from '../models/Friendship';


class FrienshipService {
  private http = RestApiService.getInstance().http;

  getAllLatest(cursor: number, limit: number) {
    const config = {
      params: { cursor, limit }
    };
    return this.http.get<GetLatestFriendships>('/friendships', config);
  }

  searchFriendsByName(friendUserName: string, cursor: number, limit: number) {
    const config = {
      params: { cursor, limit, friendUserName },
    };
    return this.http.get<GetLatestFriendships>('/friendships/search', config);
  }

  public getFriendShipByTargetUserID(targetUserUUID: string) {
    return this.http.get<GetFriendShipWithSenderAndReceiver>(`/friendships/${targetUserUUID}`);
  }

  sentFriendShipInvitation(targerUserID: number) {
    const payload = { id: targerUserID };
    return this.http.post<MutateFrienship>('/friendships', payload);
  }

  deleteFriendShipInvitation(receiverId: number) {
    return this.http.delete(`/friendships/${receiverId}`);
  }

  updateFrienshipInvitation(friendShipId: number, status: FriendShipStatus) {
    return this.http.patch<MutateFrienship>(`/friendships/${friendShipId}`, { status });
  }
}

export default new FrienshipService();
