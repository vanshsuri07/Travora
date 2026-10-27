export interface UserData {
  name: string;
  email: string;
  joinedAt: string;
  status: 'user' | 'admin';
  imageUrl: string;
  itineraryCount?: number;
}