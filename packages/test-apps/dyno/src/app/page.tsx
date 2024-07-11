import ShoppingCartExperienceContainer from '@/StudioExperiences/components/ShoppingCartExperienceContainer';
import { ProductCardList } from './products/components/ProductCardList';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Home({ params, searchParams }: Page) {
  const { locale = 'en-US' } = params || {};
  const { isPreview, expEditorMode } = searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ProductCardList />
      <ShoppingCartExperienceContainer
        locale={locale}
        isPreviewMode={preview}
        isEditorMode={editorMode}
      />
    </main>
  );
}
