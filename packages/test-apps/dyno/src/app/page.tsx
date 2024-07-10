import { ProductCardList } from './products/components/ProductCardList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ProductCardList />
    </main>
  );
}
