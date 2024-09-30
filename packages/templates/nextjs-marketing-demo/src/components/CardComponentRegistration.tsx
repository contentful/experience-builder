import React from 'react';
import { Card } from 'antd';

type CardComponentProps = {
  coverSlot: React.ReactNode;
  title: string;
  description: string;
  bordered: boolean;
  hoverable: boolean;
  size: 'default' | 'small';
};

export const CardComponentRegistration = {
  component: ({ coverSlot, title, description, bordered, hoverable, size }: CardComponentProps) => {
    return (
      <Card hoverable={hoverable} bordered={bordered} size={size} cover={coverSlot}>
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
