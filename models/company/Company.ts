import { IEvent } from '../Event';
import { ILocation } from '../Localization';


export interface ICompany {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  uid?: string;
  avatarUrl?: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  webPage?: string;
  instagramPage?: string;
  facebookPage?: string;
  events: IEvent[];
  locations: ILocation[];
}

export interface ICompanyCreate extends Pick<ICompany, 'name' | 'email' | 'uid'> { }

export interface ICompanyOnboarding extends Omit<ICompanyCreate, 'uid'> {
  password: string,
  repassword: string,
}
