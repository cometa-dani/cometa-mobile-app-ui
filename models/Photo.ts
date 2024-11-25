export interface IPhoto {
  id: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  uuid: string;
  placeholder?: string;
  order: number;
}

export type PhotoRef = Pick<IPhoto, 'uuid' | 'url' | 'placeholder'>
