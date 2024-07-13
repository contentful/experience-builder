import { updateCartData } from '@/lib/cartApi';

export const shoppingCartBehavior = (parameters: string) => {
  console.log('testBehavior', parameters);

  updateCartData();
  // updateCartData({
  //   id: '123592349234',
  //   numberOfItems: 92,
  //   totalPrice: 99.99,
  // }
};
