import { ChatGroup } from '../models/ChatGroup';
import { RestApiService } from './restService';


class ChatGroupService extends RestApiService {
  /**
   *
   * @param prefix {string}
   * @param offset {number} must be multiples of 10
   * @returns
   */
  create(groupName: string, members: (string | number)[], loggedInUserAccessToken: string) {
    return (
      this.http.post<ChatGroup>(
        '/chat-groups',
        { groupName, members },
        this.configAuthHeader(loggedInUserAccessToken)
      )
    );
  }
}


export default new ChatGroupService();
