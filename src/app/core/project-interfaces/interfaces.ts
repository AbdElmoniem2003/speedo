export class Product {
  additions: string[];
  balance: number;
  bestSeller: boolean;
  brand: string;
  brandDiscount: number;
  brandDiscountPercentage: number;
  category: Category;
  categoryDiscount: number;
  categoryDiscountPercentage: number;
  code: string;
  createdAt: string;
  description: number;
  discountPercentage: number;
  discountPrice: number;
  finalPrice: number;
  image: string;
  images: string[];
  items: [];
  name: string;
  new: false;
  offer: string;
  offerDiscount: number;
  offerDiscountPercentage: number;
  price: number;
  privatePrice: number;
  qtyIncrease: number;
  sort: string;
  special: boolean;
  status: number;
  subBrand: any;
  subCategory: string;
  subCategoryDiscount: number;
  subCategoryDiscountPercentage: number;
  totalBalance: number;
  type: number;
  updatedAt: string;

  isFav: boolean = false;
  inCart: boolean = false;
  quantity: number;

  __v: number;
  _id: string;
}

export interface Category {
  count: number;
  createdAt: string;
  discount: number;
  discountPercentage: number;
  image: string;
  name: string;
  sort: number;
  status: number;
  updatedAt: string;
  __v: number;
  _id: string;
}
export interface Brand {
  count: number;
  createdAt: string;
  discount: number;
  discountPercentage: number;
  image: string;
  name: string;
  sort: number;
  status: number;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface Slider {
  branch: any;
  category: string;
  createdAt: string;
  image: string;
  product: Product;
  status: number;
  updatedAt: string;
  url: string;
  __v: number;
  _id: string;
}
export interface Offer {
  createdAt: string;
  description: string;
  discount: number;
  discountPercentage: number;
  image: string;
  name: string;
  sort: null;
  status: number;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface Info {

  "_id": string,
  "location": string,
  "phone": string,
  "whatsapp": string,
  "facebook": string,
  "instagram": string,
  "address": string,
  "description": string,
  "status": number,
  "createdAt": string,
  "updatedAt": string,
  "__v": number

}

export interface User {
  "_id": string,
  "username": string,
  "displayName": string,
  "status": number,
  "privatePrice": boolean,
  "createdAt": string,
  "updatedAt": string,
  "__v": number,
  "accessToken": string,
  "refreshToken": string
}
