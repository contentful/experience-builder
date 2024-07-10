import React from 'react';
import { ProductCardList } from './components/ProductCardList/ProductCardList';

// type ProductPageParams = {
//   params: { locale?: string; slug?: string; preview?: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

export default async function Page() {
  return <ProductCardList />;
}
