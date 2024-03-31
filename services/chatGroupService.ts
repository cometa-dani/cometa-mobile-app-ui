import { ChatGroup, GetChatGroupById } from '../models/ChatGroup';
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

  getById(id: string, loggedInUserAccessToken: string) {
    return (
      this.http.get<GetChatGroupById>(
        `/chat-groups/${id}`,
        this.configAuthHeader(loggedInUserAccessToken)
      )
    );
  }
}


export default new ChatGroupService();
