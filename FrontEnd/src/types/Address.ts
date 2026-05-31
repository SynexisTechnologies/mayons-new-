export interface Address {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
