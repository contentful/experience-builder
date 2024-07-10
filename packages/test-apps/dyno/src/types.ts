type SpecType = {
  processor: string;
  display: string;
  hardDrive: string;
  ram: string;
};

export type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string; // URL\
  description: string;
  specs: SpecType;
};

export type CartType = {
  id: string;
  numberOfItems: number;
  totalPrice: number;
};
