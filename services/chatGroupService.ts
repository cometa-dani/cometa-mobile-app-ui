import { AxiosInstance } from 'axios';
import { ChatGroup, GetChatGroupById } from '../models/ChatGroup';
import { RestApiService } from './restService';


class ChatGroupService {

  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }

  /**
   *
   * @param prefix {string}
   * @param offset {number} must be multiples of 10
   * @returns
   */
  create(groupName: string, members: (string | number)[]) {
    return (
      this.http.post<ChatGroup>(
        '/chat-groups',
        { groupName, members },
      )
    );
  }

  getById(id: string) {
    return (
      this.http.get<GetChatGroupById>(
        `/chat-groups/${id}`,
      )
    );
  }
}


export default new ChatGroupService();
