export interface User {
  _id: string;

  first_name: string;
  last_name: string;
  email: string;
  mobile: string;

  role: "admin" | "staff";
  status: "Active" | "Inactive";

  createdAt: string;  
  updatedAt: string;
}
