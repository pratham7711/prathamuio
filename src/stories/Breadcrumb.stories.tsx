import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '../components/Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    separator: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Primary: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Widget' },
    ],
  },
}

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Dashboard' },
    ],
  },
}

export const DeepNesting: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Account', href: '/settings/account' },
      { label: 'Security', href: '/settings/account/security' },
      { label: 'Two-Factor Auth' },
    ],
  },
}

export const CustomSeparator: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Breadcrumb
        separator=">"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'API' },
        ]}
      />
      <Breadcrumb
        separator="|"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Post' },
        ]}
      />
      <Breadcrumb
        separator="~"
        items={[
          { label: 'Root', href: '/' },
          { label: 'Users', href: '/users' },
          { label: 'Profile' },
        ]}
      />
    </div>
  ),
}

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home' }],
  },
}
