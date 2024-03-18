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

  public getFriendShipByTargetUserID(targetUserID: number, accessToken: string) {
    return this.http.get<GetFriendShipWithSenderAndReceiver>(`/friendships/${targetUserID}`, this.configAuthHeader(accessToken));
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
