import { GetFriendShipWithSenderAndReceiver, GetLatestFriendships, MutateFrienship } from '../models/Friendship';
import { RestApiService } from './restService';


class FrienshipService extends RestApiService {
  getAllLatest(cursor: number, limit: number, accessToken: string) {
    const config = {
      params: { cursor, limit },
      ...this.configAuthHeader(accessToken)
    };
    return this.http.get<GetLatestFriendships>('/friendships', config);
  }

  searchFriendsByName(cursor: number, limit: number, friendUserName: string, accessToken: string) {
    const config = {
      params: { cursor, limit, friendUserName },
      ...this.configAuthHeader(accessToken)
    };
    return this.http.get<GetLatestFriendships>('/friendships/search', config);
  }

  public getFriendShipByTargetUserID(targetUserUUID: string, accessToken: string) {
    return this.http.get<GetFriendShipWithSenderAndReceiver>(`/friendships/${targetUserUUID}`, this.configAuthHeader(accessToken));
  }

  sentFriendShipInvitation(receiverId: number, accessToken: string) {
    const payload = { id: receiverId };
    return this.http.post<MutateFrienship>('/friendships', payload, this.configAuthHeader(accessToken));
  }

  cancelFriendShipInvitation(receiverId: number, accessToken: string) {
    return this.http.delete(`/friendships/${receiverId}`, this.configAuthHeader(accessToken));
  }

  acceptFriendShipInvitation(friendShipId: number, accessToken: string) {
    return this.http.patch<MutateFrienship>(`/friendships/${friendShipId}`, null, this.configAuthHeader(accessToken));
  }
}

export default new FrienshipService();
