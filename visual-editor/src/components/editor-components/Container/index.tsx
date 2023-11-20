import React, { CSSProperties } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';

import { ComponentConfig, DropZone } from '../../../core';
import { Section } from '../Section';
import './styles.css';

export type ContainerProps = {
  padding: number;
  margin: number;
  backgroundImage?: string;
  maxWidth: string;
};

export const Container: ComponentConfig<ContainerProps> = {
  fields: {
    maxWidth: {
      type: 'text',
    },
    padding: {
      type: 'number',
    },
    margin: {
      type: 'number',
    },
    backgroundImage: {
      type: 'text',
      label: 'Background Image',
    },
  },
  defaultProps: {
    padding: 0,
    margin: 0,
    backgroundImage: '',
    maxWidth: '100%',
  },
  render: ({ padding, margin, backgroundImage, maxWidth }) => {
    const backgroundStyle: CSSProperties = backgroundImage
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }
      : {};

    return (
      <Section
        padding={`${padding}px`}
        maxWidth={maxWidth}
        style={{
          ...backgroundStyle,
          margin,
        }}>
        <DropZone
          style={{
            backgroundColor: 'transparent',
          }}
          zone={`item-1`}
        />
      </Section>
    );
  },
};
