import { Friendship, GetLatestFriendships } from '../models/Friendship';
import { RestApiService } from './restService';


class FrienshipService extends RestApiService {
  getAllLatest(cursor: number, limit: number, accessToken: string) {
    const config = {
      params: { cursor, limit },
      ...this.configAuthHeader(accessToken)
    };
    return this.http.get<GetLatestFriendships>('/friendships', config);
  }

  public getFriendShipByReceiverID(receiverId: number, accessToken: string) {
    return this.http.get<Friendship>(`/friendships/${receiverId}`, this.configAuthHeader(accessToken));
  }

  sentFriendShipInvitation(receiverId: number, accessToken: string) {
    const payload = { id: receiverId };
    return this.http.post<Friendship>('/friendships', payload, this.configAuthHeader(accessToken));
  }

  acceptFriendShipInvitation(friendShipId: number, accessToken: string) {
    return this.http.patch<Friendship>(`/friendships/${friendShipId}`, null, this.configAuthHeader(accessToken));
  }
}

export default new FrienshipService();
