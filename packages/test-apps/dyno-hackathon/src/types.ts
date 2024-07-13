export type CartType = {
  id: string;
  numberOfItems: number;
  totalPrice: number;
};

export type ContentfulConfig = {
  space: string;
  accessToken: string;
  previewToken: string;
  domain: string;
  environment: string;
  experienceTypeId: string;
};
