export interface Location {
  id: number;
  createdAt: string;
  updatedAt: string;
  organizationId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  mediaUrls: string[];
}
