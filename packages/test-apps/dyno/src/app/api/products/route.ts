import { ProductType } from '@/types';
import { NextResponse } from 'next/server';

// Example product data
const products: ProductType[] = [
  {
    id: 1,
    name: 'Dell XPS',
    price: 1499.99,
    description:
      'The first Copilot+ XPS has powerful, on-device AI that delivers cutting-edge responsiveness and unmatched speed for navigating demanding multitasking workloads, enhanced security and efficiency in our thinnest and lightest XPS. The XPS 13 powered by Snapdragon® X Elite, effortlessly tackles complex workloads and offers groundbreaking multi-day battery life; the longest runtime in its class.',
    image: 'https://www.dell.com/wp-uploads/2024/01/Diablo-Platinum-v2.jpg',
    specs: {
      processor: 'Intel i9',
      display: '4k',
      hardDrive: '2TB',
      ram: '16G',
    },
  },
  {
    id: 2,
    name: 'Macbook Pro',
    price: 1699.99,
    image:
      'https://www.apple.com/newsroom/images/product/mac/standard/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_2x.jpg',
    description:
      'Behold an entirely new class of GPU architecture. And the biggest breakthrough in graphics yet for Apple silicon. Dynamic Caching optimizes fast on-chip memory to dramatically increase average GPU utilization — driving a huge performance boost for the most demanding pro apps and games.',
    specs: {
      processor: 'Apple M3',
      display: '4k',
      hardDrive: '1.5TB',
      ram: '12G',
    },
  },
  {
    id: 3,
    name: 'HP',
    price: 999.99,
    image: 'https://www.hp.com/gb-en/shop/Html/Merch/Images/c08505663_1750x1285.jpg',
    description:
      'The extremely flexible and compact HP Pavilion x360 15.6 inch 2-in-1 Laptop PC is designed to adapt to find just the angle you need. Stream your favorite series for longer with a long battery life and HP Fast Charge. Dual Speakers with Audio by B&O provide immersive sound. Sustainably designed, containing post-consumer recycled and ocean-bound plastics',
    specs: {
      processor: 'AMD Ryzen',
      display: '1080p',
      hardDrive: '1TB',
      ram: '8G',
    },
  },
];

// GET: /api/products
export async function GET() {
  return NextResponse.json(products);
}
