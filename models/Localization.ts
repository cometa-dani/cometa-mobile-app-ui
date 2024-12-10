export interface ILocation {
  id: number;
  createdAt: string;
  updatedAt: string;
  organizationId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  mapUrl?: string;
  mediaUrls: string[];
}
