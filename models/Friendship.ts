export interface Friendship {
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number;
  status: Status;
}

type Status = 'PENDING' | 'ACCEPTED' | 'BLOCKED'
