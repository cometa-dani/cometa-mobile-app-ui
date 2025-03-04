import { ILastMessage } from './Friendship';


export interface INotification extends
  Omit<ILastMessage, ('messages' | 'lastMessage')> { }
