import React from 'react';

import { ComponentConfig, DropZone } from '../../../core';
import { Section } from '../Section';
import './styles.css';

export type FlexProps = {
  items: { minItemWidth?: number }[];
  minItemWidth: number;
};

export const Flex: ComponentConfig<FlexProps> = {
  fields: {
    items: {
      type: 'array',
      arrayFields: {
        minItemWidth: {
          label: 'Minimum Item Width',
          type: 'number',
        },
      },
      getItemSummary: (_, id: any) => `Item ${id + 1}`,
    },
    minItemWidth: {
      label: 'Minimum Item Width',
      type: 'number',
    },
  },
  defaultProps: {
    items: [{}, {}],
    minItemWidth: 356,
  },
  render: ({ items, minItemWidth }) => {
    return (
      <Section>
        <div className={'Flex'}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={'Flex-item'}
              style={{ minWidth: item.minItemWidth || minItemWidth }}>
              <DropZone zone={`item-${idx}`} />
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
