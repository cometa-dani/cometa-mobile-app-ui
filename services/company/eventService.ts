import { ICreateEvent, IEvent } from '@/models/Event';
import { RestApiService } from '../restService';
import FormData from 'form-data';
import { IPhotoPlaceholder } from '@/components/onboarding/photosGrid/photoGrid';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { IOrganization } from '@/models/Organization';


class EventService {
  private http = RestApiService.getInstance().http;

  /**
   *
   * @description Parse the categories object to a string
   */
  private _parseCategories = (params: object): string => {
    const initialValue = '';
    return (
      Object
        .values(params)
        .filter(val => val)
        .reduce(
          (prev, curr) => (
            prev ? prev?.concat(`,${curr}`.toUpperCase())
              : `${curr?.toUpperCase()}`)
          ,
          initialValue
        ).trim()
    );
  };

  public getAllEvents(organizationId: number) {
    return this.http.get<IEvent[]>(`/organizations/${organizationId}/events`);
  }

  public getEventByID(eventID: number) {
    return this.http.get<IEvent>(`/organizations/events/${eventID}`);
  }

  public create(organizationId: number, payload: ICreateEvent) {
    const categories = this._parseCategories(payload.categories);
    return this.http.post<IEvent>(`/organizations/${organizationId}/events`, { ...payload, categories });
  }

  public deleteEvent(organizationId: number, eventId: number) {
    return this.http.delete<void>(`/organizations/${organizationId}/events/${eventId}`);
  }

  public async uploadPhotos(organizationId: number, eventId: number, pickedAssets: IPhotoPlaceholder[]) {
    const formData = new FormData();
    pickedAssets.forEach((pickedImgFile) => {
      const uri = pickedImgFile.fromFileSystem?.uri ?? '';
      const mimeType = pickedImgFile.fromFileSystem?.mimeType ?? '';
      const fileExtension = uri.split('.').at(-1);
      const filename = pickedImgFile.fromFileSystem?.fileName ?? '';
      formData.append('files', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: filename || Crypto.randomUUID(),
        type: mimeType || `image/${fileExtension}`,
      });
    });
    return (
      this.http.post<IOrganization>(`/organizations/${organizationId}/events/${eventId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: () => {
          return formData; // this is doing the trick
        }
      })
    );
  }
}

export default new EventService();
