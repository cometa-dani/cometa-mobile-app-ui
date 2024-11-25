import { AxiosInstance } from 'axios';
import { IChatGroup, IGetChatGroupById } from '../models/ChatGroup';
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
      this.http.post<IChatGroup>(
        '/chat-groups',
        { groupName, members },
      )
    );
  }

  getById(id: string) {
    return (
      this.http.get<IGetChatGroupById>(
        `/chat-groups/${id}`,
      )
    );
  }
}


export default new ChatGroupService();
