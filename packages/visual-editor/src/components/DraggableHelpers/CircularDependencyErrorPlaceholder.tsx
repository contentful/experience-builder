import { useEntityStore } from '@/store/entityStore';
import React, { HTMLAttributes } from 'react';

type CircularDependencyErrorPlaceholderProperties = HTMLAttributes<HTMLDivElement> & {
  wrappingPatternIds: Set<string>;
};

export const CircularDependencyErrorPlaceholder = ({
  wrappingPatternIds,
  ...props
}: CircularDependencyErrorPlaceholderProperties) => {
  const entityStore = useEntityStore((state) => state.entityStore);

  return (
    <div
      {...props}
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
