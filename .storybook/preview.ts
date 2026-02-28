import type { Preview } from '@storybook/react'
import '../src/styles/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#080810' },
        { name: 'darker', value: '#000000' },
        { name: 'surface', value: '#0f0f1a' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
