import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../components/Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Badge>

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
}

export const Outlined: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="accent" outlined>Accent</Badge>
      <Badge variant="success" outlined>Success</Badge>
      <Badge variant="warning" outlined>Warning</Badge>
      <Badge variant="danger" outlined>Danger</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="success" dot>Online</Badge>
      <Badge variant="warning" dot>Away</Badge>
      <Badge variant="danger" dot>Offline</Badge>
      <Badge variant="accent" dot>Active</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="sm" variant="accent">Small</Badge>
      <Badge size="md" variant="accent">Medium</Badge>
    </div>
  ),
}
