export async function getAllProducts() {
  const response = await fetch('http://localhost:3000/api/products');

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}
