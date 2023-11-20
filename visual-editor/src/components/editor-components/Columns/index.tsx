import React from 'react';
import './styles.css';
import { DropZone, ComponentConfig } from '../../../core';
import { Section } from '../Section';

export type ColumnsProps = {
  distribution: 'auto' | 'manual';
  columns: {
    span?: number;
  }[];
};

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    distribution: {
      type: 'radio',
      options: [
        {
          value: 'auto',
          label: 'Auto',
        },
        {
          value: 'manual',
          label: 'Manual',
        },
      ],
    },
    columns: {
      type: 'array',
      getItemSummary: (col, id: any) =>
        `Column ${id + 1}, span ${col.span ? Math.max(Math.min(col.span, 12), 1) : 'auto'}`,
      arrayFields: {
        span: {
          label: 'Span (1-12)',
          type: 'number',
        },
      },
    },
  },
  defaultProps: {
    distribution: 'auto',
    columns: [{}, {}],
  },
  render: ({ columns, distribution }) => {
    return (
      <Section>
        <div
          className="Columns"
          style={{
            gridTemplateColumns:
              distribution === 'manual' ? 'repeat(12, 1fr)' : `repeat(${columns.length}, 1fr)`,
          }}>
          {columns.map(({ span }, idx) => (
            <div
              key={idx}
              style={{
                gridColumn:
                  span && distribution === 'manual'
                    ? `span ${Math.max(Math.min(span, 12), 1)}`
                    : '',
              }}>
              <DropZone zone={`column-${idx}`} />
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
