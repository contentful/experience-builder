import React, { useEffect } from 'react';
import { Experience, ExperienceConfiguration, useNinetailed } from '@ninetailed/experience.js-next';
import { ExperienceMapper } from '@ninetailed/experience.js-utils-contentful';

import { getConfig as getClient } from '@/utils/getExperience';
import { NinetailedContainerProvider } from '@/utils/useNinetailedContainer';

type NinetailedExperienceContainerProps = React.PropsWithChildren<{
  experienceId?: string;
}>;

const IntermediateContainer = (props) => {
  const { children, studioId, ...rest } = props;

  console.log('intermediate', props);

  return (
    <>
      {/* <pre>{JSON.stringify(rest, null, 2)}</pre> */}
      <NinetailedContainerProvider selectedVariantContainerId={studioId || 'none'}>
        {children}
      </NinetailedContainerProvider>
    </>
  );
};

const NinetailedExperienceContainer: React.FC<NinetailedExperienceContainerProps> = ({
  children,
  experienceId,
}) => {
  const [experiences, setExperiences] = React.useState<ExperienceConfiguration[]>([]);
  const experience = experiences[0];
  const ninetailed = useNinetailed();

  console.log(experience);

  const ninetailedBaselineId = experience?.components[0].baseline.id;
  const studioBaselineId = children.props.node.children[0]?.data.id;

  useEffect(() => {
    const execute = async () => {
      if (!experienceId) {
        return;
      }

      ninetailed.page();

      const client = getClient(true);

      // TODO for production, we should use the nt_experience_id in the query as it's not given, that the entry id is the same.
      const fetchedExperience = await client.getEntry(experienceId);

      console.log('fetchedExperience', fetchedExperience);

      const ninetailedVariantId = fetchedExperience.fields.nt_config.components[0].variants[0].id;
      const studioVariantId = children.props.node.children[1]?.data.id;

      const mappedExperience = ExperienceMapper.mapCustomExperience(
        {
          ...fetchedExperience,
          fields: {
            ...fetchedExperience.fields,
            nt_variants: [{ sys: { id: ninetailedVariantId || '' }, fields: {} }],
          },
        },
        (variant) => {
          console.log('mapping variant', variant);

          return { id: variant.sys.id, studioId: studioVariantId };
        },
      );

      console.log('mappedExperience', mappedExperience);

      setExperiences(mappedExperience ? [mappedExperience] : []);
    };

    execute();
  }, [experienceId]);

  if (!experience) {
    return <span>please select a Ninetailed Experience</span>;
  }

  return (
    <Experience
      id={ninetailedBaselineId}
      studioId={studioBaselineId}
      experiences={experiences}
      component={IntermediateContainer}
      passthroughProps={{ children }}
    />
  );
};

export default NinetailedExperienceContainer;
