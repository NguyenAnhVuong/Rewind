export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  user: User;
  comment: string;
  rating: number;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
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