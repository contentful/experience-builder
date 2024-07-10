import { ProductType } from '@/types';
import React from 'react';
import { ProductCard } from '../ProductCard';
import { getAllProducts } from '@/lib/productApi';

export async function ProductCardList() {
  const products: ProductType[] = await getAllProducts();

  return (
    <>
      {products &&
        products.map((p: ProductType, idx: number) => {
          return (
            <div key={idx}>
              <ProductCard
                id={p.id}
                name={p.name}
                description={p.description}
                price={p.price}
                image={p.image}
                specs={p.specs}
              />
            </div>
          );
        })}
    </>
  );
}
