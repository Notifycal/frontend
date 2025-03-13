import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { countryData, languageData } from '@common/i18n';
import LanguagePicker from './LanguagePicker';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Notifycal/LanguagePicker',
  component: LanguagePicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    displayFlagOnly: { control: 'boolean' }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onLanguageSelected: fn() }
} satisfies Meta<typeof LanguagePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MainLang: Story = {
  args: {
    displayFlagOnly: false,
    languageData: languageData,
    value: 'es'
  }
};

export const SmallLang: Story = {
  args: {
    displayFlagOnly: true,
    languageData: languageData,
    value: 'en'
  }
};

export const MainCountry: Story = {
  args: {
    displayFlagOnly: false,
    languageData: countryData,
    value: 'en'
  }
};

export const SmallCountry: Story = {
  args: {
    displayFlagOnly: true,
    languageData: countryData,
    value: 'es'
  }
};
