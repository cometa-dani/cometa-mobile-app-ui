import { GetFriendShipWithSenderAndReceiver, GetLatestFriendships, MutateFrienship } from '../models/Friendship';
import { RestApiService } from './restService';
import { FriendShipStatus } from '../models/Friendship';


class FrienshipService extends RestApiService {
  getAllLatest(cursor: number, limit: number, accessToken: string) {
    const config = {
      params: { cursor, limit },
      ...this.configAuthHeader(accessToken)
    };
    return this.http.get<GetLatestFriendships>('/friendships', config);
  }

  searchFriendsByName(friendUserName: string, cursor: number, limit: number, accessToken: string) {
    const config = {
      params: { cursor, limit, friendUserName },
      ...this.configAuthHeader(accessToken)
    };
    return this.http.get<GetLatestFriendships>('/friendships/search', config);
  }

  public getFriendShipByTargetUserID(targetUserUUID: string, accessToken: string) {
    return this.http.get<GetFriendShipWithSenderAndReceiver>(`/friendships/${targetUserUUID}`, this.configAuthHeader(accessToken));
  }

  sentFriendShipInvitation(targerUserID: number, accessToken: string) {
    const payload = { id: targerUserID };
    return this.http.post<MutateFrienship>('/friendships', payload, this.configAuthHeader(accessToken));
  }

  deleteFriendShipInvitation(receiverId: number, accessToken: string) {
    return this.http.delete(`/friendships/${receiverId}`, this.configAuthHeader(accessToken));
  }

  updateFrienshipInvitation(friendShipId: number, status: FriendShipStatus, accessToken: string) {
    return this.http.patch<MutateFrienship>(`/friendships/${friendShipId}`, { status }, this.configAuthHeader(accessToken));
  }
}

export default new FrienshipService();
