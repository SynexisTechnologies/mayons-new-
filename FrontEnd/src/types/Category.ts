export interface Category {
  _id: string;
  titleKey?: string;
  name: string;
  image?: string;
  items?: any[];
  discount?: number;
  createdAt: string;
  updatedAt: string;
}
