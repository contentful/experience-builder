export async function getCartData(cartId: string) {
  const response = await fetch(`http://localhost:3000/api/cart`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}
