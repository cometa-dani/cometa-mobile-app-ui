export interface Photo {
  id: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  uuid: string;
  placeholder?: string;
  order: number;
}

export type PhotoRef = Pick<Photo, 'uuid' | 'url' | 'placeholder'>
