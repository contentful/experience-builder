'use client';

import { FC } from 'react';
export const AddToCartButton: FC = () => {
  // console.log('[ <AddToCartButton> ] => ');

  return (
    <button className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded hover:bg-green-900 transition duration-200 ease-in-out">
      Add to Cart
    </button>
  );
};
