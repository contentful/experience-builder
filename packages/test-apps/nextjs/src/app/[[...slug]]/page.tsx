import Experience from '@/components/Experience';
import {
  getAllAudiences,
  getAllNinetailedAudiences,
  getAllNinetailedExperiences,
  getExperience,
} from '@/utils/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { Providers } from '@/components/Providers';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { isPreview, expEditorMode } = searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  const ninetailedExperiences = await getAllNinetailedExperiences();
  const ninetailedAudiences = await getAllNinetailedAudiences();

  console.log('ninetailed experiences', ninetailedExperiences);

  // const fetchedExperience = await client.getEntry(experienceId);

  // console.log('fetchedExperience', fetchedExperience);

  // const ninetailedVariantId = fetchedExperience.fields.nt_config.components[0].variants[0].id;
  // const studioVariantId = children.props.node.children[1]?.data.id;

  // const mappedExperience = ExperienceMapper.mapCustomExperience({
  //     ...fetchedExperience,
  //     fields: {...fetchedExperience.fields, nt_variants: [{sys: {id: ninetailedVariantId || ''}, fields: {}}]}
  // }, (variant) => {
  //     console.log('mapping variant', variant);

  //     return { id: variant.sys.id, studioId: studioVariantId };
  // });

  if (error) {
    return <div>{error.message}</div>;
  }

  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  //experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <Providers preview={{ experiences: ninetailedExperiences, audiences: ninetailedAudiences }}>
      <main style={{ width: '100%' }}>
        {stylesheet && <style data-css-ssr>{stylesheet}</style>}
        <Experience experienceJSON={experienceJSON} locale={locale} />
      </main>
    </Providers>
  );
}
