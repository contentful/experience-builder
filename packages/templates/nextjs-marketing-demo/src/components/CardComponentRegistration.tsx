import React from 'react';
import { Card } from 'antd';

type CardComponentProps = {
  title: string;
  description: string;
  coverImageUrl?: string;
  coverImageAltText?: string;
  bordered: boolean;
  hoverable: boolean;
  size: 'default' | 'small';
};

export const CardComponentRegistration = {
  component: ({
    title,
    description,
    bordered,
    hoverable,
    size,
    coverImageUrl,
    coverImageAltText,
  }: CardComponentProps) => {
    return (
      <Card
        hoverable={hoverable}
        bordered={bordered}
        size={size}
        style={{ width: 375, maxWidth: '100%' }}
        cover={
          coverImageUrl && (
            <div style={{ overflow: 'hidden', height: 300 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={coverImageAltText ?? 'cover image'}
                style={{ width: '100%' }}
              />
            </div>
          )
        }>
        <Card.Meta title={title} description={description} />
      </Card>
    );
  },
  definition: {
    id: 'custom-card',
    name: 'Card',
    category: 'Custom Components',
    variables: {
      title: {
        displayName: 'Title',
        type: 'Text',
        defaultValue: 'Title',
      },
      description: {
        displayName: 'Description',
        type: 'Text',
        defaultValue: 'Description',
      },
      coverImageUrl: {
        displayName: 'Cover Image URL',
        type: 'Media',
      },
      coverImageAltText: {
        displayName: 'Cover Image Alt Text',
        type: 'Text',
      },
      bordered: {
        displayName: 'Bordered',
        type: 'Boolean',
        defaultValue: false,
        group: 'style',
      },
      hoverable: {
        displayName: 'Hoverable',
        type: 'Boolean',
        defaultValue: false,
        group: 'style',
      },
      size: {
        displayName: 'Size',
        type: 'Text',
        defaultValue: 'default',
        group: 'style',
        validations: {
          in: [
            { value: 'default', displayName: 'Default' },
            { value: 'small', displayName: 'Small' },
          ],
        },
      },
    },
  },
};
