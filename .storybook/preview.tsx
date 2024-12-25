import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

import { MantineProvider } from '@mantine/core';

// Import to main styles file
import '@styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light'
    }),
    (renderStory: any) => <MantineProvider>{renderStory()}</MantineProvider>
  ]
};

export default preview;
