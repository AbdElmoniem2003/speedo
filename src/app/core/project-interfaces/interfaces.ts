export interface Product {
  additions: string[];
  balance: number;
  bestSeller: boolean;
  brand: string;
  brandDiscount: number;
  brandDiscountPercentage: number;
  category: string;
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
  "location": null,
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
