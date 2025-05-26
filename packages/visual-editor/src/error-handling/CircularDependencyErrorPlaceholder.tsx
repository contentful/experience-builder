import { useEntityStore } from '@/store/entityStore';
import { ExperienceTreeNode } from '@contentful/experiences-core/types';
import React from 'react';

type CircularDependencyErrorPlaceholderProperties = {
  node: ExperienceTreeNode;
  wrappingPatternIds: Set<string>;
};

export const CircularDependencyErrorPlaceholder = ({
  node,
  wrappingPatternIds,
}: CircularDependencyErrorPlaceholderProperties) => {
  const entityStore = useEntityStore((state) => state.entityStore);

  return (
    <div
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}
      data-cf-node-error="circular-pattern-dependency"
      style={{
        border: '1px solid red',
        background: 'rgba(255, 0, 0, 0.1)',
        padding: '1rem 1rem 0 1rem',
        width: '100%',
        height: '100%',
      }}>
      Circular usage of patterns detected:
      <ul>
        {Array.from(wrappingPatternIds).map((patternId) => {
          const entryLink = { sys: { type: 'Link', linkType: 'Entry', id: patternId } } as const;
          const entry = entityStore.getEntityFromLink(entryLink);
          const entryTitle = entry?.fields?.title;
          const text = entryTitle ? `${entryTitle} (${patternId})` : patternId;
          return <li key={patternId}>{text}</li>;
        })}
      </ul>
    </div>
  );
};
