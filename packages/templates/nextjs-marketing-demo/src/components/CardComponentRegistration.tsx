import React from 'react';
import { Card } from 'antd';

type CardComponentProps = {
  coverSlot: React.ReactNode;
  title: string;
  description: string;
  size: 'default' | 'small';
};

export const CardComponentRegistration = {
  component: ({ coverSlot, title, description, size }: CardComponentProps) => {
    return (
      <Card size={size} cover={coverSlot}>
        <Card.Meta title={title} description={description} />
      </Card>
    );
  },
  definition: {
    id: 'custom-card',
    name: 'Card',
    category: 'Custom Components',
    slots: {
      coverSlot: {
        displayName: 'Cover Slot',
      },
    },
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
