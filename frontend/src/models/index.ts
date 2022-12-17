export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Comment {
  id: number;
  content: string;
  rating: number;
  restaurant_id: number;
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
  comment: Comment[];
}