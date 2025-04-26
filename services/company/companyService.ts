import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { IPhotoPlaceholder } from '@/components/onboarding/photosGrid/photoGrid';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { RestApiService } from '../restService';
import { ICompany, ICompanyCreate } from '@/models/company/Company';


class CompanyService {
  private http: AxiosInstance;

  constructor() {
    this.http = RestApiService.getInstance().http;
  }

  public create(payload: ICompanyCreate) {
    return this.http.post<ICompany>('/organizations', payload);
  }

  /**
   *
   * @param {string} uuid can be either the loggedInUser or the targetUser
   * @param {string} loggedInUserAccessToken
   * @returns
   */
  public getProfile(uuid: string) {
    return this.http.get<ICompany>(`/organizations/${uuid}`);
  }

  public async uploadUserPhotos(userId: number, pickedAssets: IPhotoPlaceholder[]) {
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
      this.http.post<ICompany>(`/organizations/${userId}/photos`, formData, {
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


export const companyService = new CompanyService();
