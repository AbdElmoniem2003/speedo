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
  _id: string;
  location: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  address: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  status: number;
  privatePrice: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
  refreshToken: string;
}

export interface Branch {
  createdAt: string;
  distance: number;
  driverService: number;
  endDate: number;
  fastDriverService: number;
  isOpen: boolean;
  location: null;
  name: string;
  openDate: number;
  service: number;
  status: number;
  updatedAt: string;
  __v: number;
  _id: string;
}


export interface ProductOrder {
  product: Product,
  // quantity: number,
  qty: number,
  price: number,
  note: string,
  additions: any[],
  selectedAdditions?: [
    {
      addition: string,
      name: string,
      subName: string,
      price: number,
      subAdditions: string,
      subAdditionPrice: number,
      total: number,
    }
  ]
}

export interface Order {
  _id: string,
  user: string,
  branch: string,
  order: ProductOrder[],
  country: Country,
  countryCost: number,
  location: {
    lat: number,
    lng: number
  },
  type: number,
  total: number,
  discount: number,
  service: number,
  phone: string,
  displayName: string,
  deliveryDate: Date,
  address: string,
  privatePrice: boolean,
  note: string,
  refuseReason: string,
  status: number,
  createdAt: Date,
  updatedAt: Date,
  orderNumber: number,
  netTotal: number,
  orderPrice: number,
}
export interface OrderType {
  status: number,
  name: string,
  type: number,
  description: string,
}
export interface Country {
  name: string,
  cost: number,
  status: number,
  _v: number,
  _id: number
}

export interface OrderData {
  address: string;
  branch: string;
  country: string | null;
  countryCost: number;
  coupon: string | null;
  couponDiscount: number | null;
  createdAt: string;
  deliveryDate: string | null;
  discount: number;
  displayName: string;
  location: Location;
  note: string;
  order: Product[];
  orderNumber: number;
  orderPrice: number;
  phone: string;
  privatePrice: boolean;
  refuseReason: string;
  service: number;
  speedoStatus: number;
  status: number;
  total: number;
  type: number;
  updatedAt: string;
  user: string;
  __v: number;
  _id: string;
}

export interface Notification {
  _id: string,
  title: string,
  image?: string,
  body?: Category | string,
  status?: number,
  topic: string,
  order: string,
  category: string,
  product: string,
  offer: string,
  data?: {
    orderId: string,
    categoryId: string,
    productId: string,
    offerId: string,
  },
  createdAt?: Date,
  updatedAt?: Date,
}
