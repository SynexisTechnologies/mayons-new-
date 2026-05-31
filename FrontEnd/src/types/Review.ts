export interface Review {
  _id: string;
  product: string;
  user: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
