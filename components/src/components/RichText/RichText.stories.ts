import type { Meta, StoryObj } from '@storybook/react';
import { BLOCKS } from '@contentful/rich-text-types';

import { ExperienceBuilderRichText } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Example/RichText',
  component: ExperienceBuilderRichText,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    experienceBuilder: ExperienceBuilderRichText.ComponentDefinition,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof ExperienceBuilderRichText>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    value: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: 'text', value: 'abc', marks: [], data: {} }],
        },
      ],
    },
  },
};
