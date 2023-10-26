import type { Meta, StoryObj } from '@storybook/react';

import { ExperienceBuilderHeading } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Example/Heading',
  component: ExperienceBuilderHeading,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    experienceBuilder: ExperienceBuilderHeading.ComponentDefinition,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof ExperienceBuilderHeading>;

export default meta;
type Story = StoryObj<typeof ExperienceBuilderHeading>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    text: 'My heading',
  },
};
