import type { Meta, StoryObj } from '@storybook/react';

import Logo from './Logo';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Notifycal/Logo',
  component: Logo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    classNames: { control: 'text' }
  }
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: {
    classNames: 'mx-auto w-[250px]',
    animation: 'static',
    showCalendarDays: true
  }
};

export const DefaultAnimation: Story = {
  args: {
    classNames: 'mx-auto w-[250px]',
    animation: 'default',
    showCalendarDays: true
  }
};

export const Bouncy: Story = {
  args: {
    classNames: 'mx-auto w-[250px]',
    animation: 'bouncy',
    showCalendarDays: true
  }
};

export const StaticWithoutDays: Story = {
  args: {
    classNames: 'mx-auto w-[250px]',
    animation: 'static',
    showCalendarDays: false
  }
};

export const BouncyWithoutDays: Story = {
  args: {
    classNames: 'mx-auto w-[250px]',
    animation: 'bouncy',
    showCalendarDays: false
  }
};
