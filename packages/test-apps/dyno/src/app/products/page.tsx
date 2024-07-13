import React from 'react';
import { ProductCardList } from './components/ProductCardList/ProductCardList';
// import ShoppingCartExperienceContainer from '@/StudioExperiences/components/ShoppingCartExperienceContainer';
import { Cart } from '@/components/Cart';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Page) {
  const { locale = 'en-US' } = params || {};
  const { isPreview, expEditorMode } = searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';

  return (
    <>
      <ProductCardList />;
      {/* <ShoppingCartExperienceContainer
        locale={locale}
        isPreviewMode={preview}
        isEditorMode={editorMode}
      /> */}
      <Cart />
    </>
  );
}
