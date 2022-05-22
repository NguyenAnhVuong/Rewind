export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Review {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  avatar: string;
  user_id: number;
  user: string;
  images: string[];
}