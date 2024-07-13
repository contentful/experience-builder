import { CartType } from '@/types';
import { NextResponse } from 'next/server';

// Example Cart data
const cartData: CartType = {
  id: `273847`,
  numberOfItems: 0,
  totalPrice: 0,
};

// GET: /api/cart
export async function GET() {
  return NextResponse.json(cartData);
}

// POST: /api/cart
export async function POST(req: Request) {
  const r = await req.json();

  console.log('[ /POST ] /cart r => ', r);

  const updatedCartData = {
    id: `273847`,
    numberOfItems: cartData.numberOfItems + 1,
    totalPrice: cartData.totalPrice,
  };

  return NextResponse.json(updatedCartData);
}
