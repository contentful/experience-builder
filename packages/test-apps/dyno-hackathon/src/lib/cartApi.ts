// import { CartType } from '@/types';

export async function getCartData(/*cartId: string*/) {
  const response = await fetch(`http://localhost:3000/api/cart`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

// export async function updateCartData({ id, numberOfItems, totalPrice }: CartType) {
export async function updateCartData() {
  // const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
  const response = await fetch(`http://localhost:3000/api/cart`, {
    method: 'POST',
    // body: JSON.stringify({
    // id,
    // numberOfItems,
    // totalPrice,
    // }),
  });

  console.log('[ [cartApi.ts] ] incrementCartData() response => ', response);

  return response.json();
}
