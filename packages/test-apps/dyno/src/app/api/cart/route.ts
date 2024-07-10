// import { CartType } from "@/types";
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
