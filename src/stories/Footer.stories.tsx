import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from '../components/Footer'

const meta: Meta<typeof Footer> = {
  title: 'UI/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  render: () => (
    <Footer
      brand="Pratham.dev"
      tagline="Building things for the web."
      links={[
        { label: 'Work', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'GitHub', href: '#' },
        { label: 'Twitter', href: '#' },
      ]}
      copyright="© 2025 Pratham. Built with ❤️"
      bottomRight={
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="#" style={{ color: 'var(--ui-text-2)', fontSize: '12px' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--ui-text-2)', fontSize: '12px' }}>Terms</a>
        </div>
      }
    />
  ),
}

export const Minimal: Story = {
  render: () => (
    <Footer
      brand="Brand"
      copyright="© 2025"
    />
  ),
}
