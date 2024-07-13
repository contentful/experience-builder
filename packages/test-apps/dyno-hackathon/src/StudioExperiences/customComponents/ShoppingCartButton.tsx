import { FC, useEffect, useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { CartType } from '../../types';
import { getCartData } from '../../lib/cartApi';

const CART_ID = `2749284`;

export const ShoppingCartButton: FC = () => {
  const [cartData, setCartData] = useState<CartType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const retrieveCartData = async () => {
      setIsLoading(true);

      try {
        //@ts-ignore
        const response = await getCartData(CART_ID);
        setIsLoading(false);
        setCartData(response);
      } catch (e) {
        console.error(e);
      }
    };

    retrieveCartData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4">
      <div className="bg-emerald-900 text-slate-100 rounded-lg p-2 mb-2 mr-2 text-center">
        <p>items: {cartData?.numberOfItems}</p>
        {/* <p>${cartData?.totalPrice}</p> */}
      </div>
      <button className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-200 ease-in-out">
        <ShoppingCartIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
